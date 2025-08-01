import {
  Inject,
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

import { DataSourceConfig } from './datasource.config';
import { ConfigType } from '@nestjs/config';
import { TenantEntity } from '@tenancy/entities/tenant.entity';
import { TenantContext } from '@tenancy/tenant.context';
import { join } from 'path';

export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private tenantConnections = new Map<string, DataSource>();
  private defaultDataSource: DataSource;

  constructor(
    @Inject(DataSourceConfig.KEY)
    private readonly dbConfig: ConfigType<typeof DataSourceConfig>,
  ) {}

  async onModuleInit() {
    await this._initializeDefaultConnection();
    await this._initializeTenantConnections();
    await this.defaultDataSource.destroy();
    this.logger.log('Default connection closed after tenant loading');
  }

  async onModuleDestroy() {
    for (const [tenantId, dataSource] of this.tenantConnections) {
      await dataSource.destroy();
      this.logger.log(`Closed connection for tenant: ${tenantId}`);
    }
  }

  private async _initializeDefaultConnection() {
    const options: DataSourceOptions = {
      type: this.dbConfig.type,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      port: this.dbConfig.port,
      database: this.dbConfig.database,
      logging: this.dbConfig.logging,
      host: this.dbConfig.host,
      entities: [__dirname + '/../tenancy/**/*.entity{.ts,.js}'],
      migrations: [],
      synchronize: false,
    };

    this.defaultDataSource = new DataSource(options);
    await this.defaultDataSource.initialize();
    this.logger.log('Default connection initialized');
  }

  private async _initializeTenantConnections() {
    const tenantRepo = this.defaultDataSource.getRepository(TenantEntity);
    const tenantList = await tenantRepo.find();

    for (const tenant of tenantList) {
      await this._createTenantConnection(tenant.id);
    }
  }

  private async _createTenantConnection(tenantId: Number) {
    const options: DataSourceOptions = {
      type: this.dbConfig.type,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      port: this.dbConfig.port,
      database: `${this.dbConfig.tenantDbPrefix}${tenantId}`,
      logging: this.dbConfig.logging,
      host: this.dbConfig.host,
      entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
      migrations: [],
      synchronize: false,
    };

    const connection = new DataSource(options);
    await this.defaultDataSource.initialize();
    this.tenantConnections.set(tenantId + '', connection);
  }

  public getDataSource(): DataSource {
    const tenantId = TenantContext.getTenantId();

    if (tenantId === 'master') return this.defaultDataSource;
    const connection = this.tenantConnections.get(tenantId);
    if (!connection) {
      throw new Error(`No tenant connection found for tenantId: ${tenantId}`);
    }

    return connection;
  }

  public getRepository<T extends ObjectLiteral>(
    entity: new () => T,
  ): Repository<T> {
    return this.getDataSource().getRepository(entity);
  }
}
