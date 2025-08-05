import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { TenantEntity } from '@tenancy/entities/tenant.entity';
import { TenantContext } from '@tenancy/tenant.context';
import { join } from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private tenantConnections = new Map<string, DataSource>();
  private defaultDataSource: DataSource;

  constructor(private readonly dbConfig: ConfigService) {}

  async onModuleInit() {
    await this.initializeDefaultConnection();
    await this.initializeTenantConnections();
    await this.defaultDataSource.destroy();
    this.logger.log('Default connection closed after tenant loading');
  }

  async onModuleDestroy() {
    for (const [tenantId, dataSource] of this.tenantConnections) {
      await dataSource.destroy();
      this.logger.log(`Closed connection for tenant: ${tenantId}`);
    }
  }

  private async initializeDefaultConnection() {
    const options: DataSourceOptions = {
      type: 'mysql',
      username: this.dbConfig.getOrThrow('DB_USER_NAME'),
      password: this.dbConfig.getOrThrow('DB_PASSWORD'),
      port: this.dbConfig.getOrThrow<number>('DB_PORT_NUMBER'),
      database: this.dbConfig.getOrThrow('DB_NAME'),
      logging: this.dbConfig.getOrThrow<boolean>('DB_LOGGING'),
      host: this.dbConfig.getOrThrow('DB_HOST_NAME'),
      entities: [__dirname + '/../tenancy/**/*.entity{.ts,.js}'],
      migrations: [],
      synchronize: false,
    };

    this.defaultDataSource = new DataSource(options);
    await this.defaultDataSource.initialize();
    this.logger.log('Default (master) connection initialized');
  }

  private async initializeTenantConnections() {
    const tenantRepo = this.defaultDataSource.getRepository(TenantEntity);
    const tenants = await tenantRepo.find();

    for (const tenant of tenants) {
      await this.createTenantConnection(String(tenant.id));
    }
  }

  private async createTenantConnection(tenantId: string) {
    const options: DataSourceOptions = {
      type: 'mysql',
      username: this.dbConfig.getOrThrow('DB_USER_NAME'),
      password: this.dbConfig.getOrThrow('DB_PASSWORD'),
      port: this.dbConfig.getOrThrow<number>('DB_PORT_NUMBER'),
      logging: this.dbConfig.getOrThrow<boolean>('DB_LOGGING'),
      host: this.dbConfig.getOrThrow('DB_HOST_NAME'),
      database: `${this.dbConfig.getOrThrow('TENANT_DB_PREFIX')}${tenantId}`,
      entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
      migrations: [],
      synchronize: false,
    };

    const tenantDataSource = new DataSource(options);
    await tenantDataSource.initialize();

    this.tenantConnections.set(tenantId, tenantDataSource);
    this.logger.log(`Tenant connection established: tenantId=${tenantId}`);
  }

  public getDataSource(): DataSource {
    const tenantId = TenantContext.getTenantId();

    if (!tenantId) {
      throw new Error('Tenant ID not found in context');
    }

    if (tenantId === 'master') return this.defaultDataSource;

    const connection = this.tenantConnections.get(tenantId);
    if (!connection) {
      throw new Error(`Invalid tenantId: ${tenantId}`);
    }

    return connection;
  }

  public getRepository<T extends ObjectLiteral>(
    entity: new () => T,
  ): Repository<T> {
    return this.getDataSource().getRepository(entity);
  }
}
