// src/database/database.service.ts

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { TenantEntity } from '@tenancy/entities/tenant.entity';
import { TenantContext } from '@tenancy/tenant.context';
import { DatasourceFactoryService } from './datasource.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private tenantConnections = new Map<string, DataSource>();
  private defaultDataSource: DataSource;

  constructor(private readonly datasourceFactory: DatasourceFactoryService) {}

  async onModuleInit() {
    await this.initializeDefaultConnection();
    await this.initializeTenantConnections();
  }

  async onModuleDestroy() {
    for (const [tenantId, dataSource] of this.tenantConnections) {
      await dataSource.destroy();
      this.logger.log(`Closed connection for tenant: ${tenantId}`);
    }
    if (this.defaultDataSource) {
      await this.defaultDataSource.destroy();
      this.logger.log(`Closed default (master) connection`);
    }
  }

  private async initializeDefaultConnection() {
    this.defaultDataSource = await this.datasourceFactory.create({});
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
    const dataSource = await this.datasourceFactory.create({ tenantId });
    this.tenantConnections.set(tenantId, dataSource);
    this.logger.log(`Tenant connection established: tenantId=${tenantId}`);
  }

  async createTenantConnectionWithMigration(tenantId: string): Promise<void> {
    const dataSource = await this.datasourceFactory.create({
      tenantId,
    });
    await dataSource.runMigrations();
    this.tenantConnections.set(tenantId, dataSource);
    this.logger.log(
      `Migrations run and connection established: tenantId=${tenantId}`,
    );
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
