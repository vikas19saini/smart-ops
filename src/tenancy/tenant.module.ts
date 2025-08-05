import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { DatasourceFactoryService } from '@database/datasource.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService, DatasourceFactoryService],
})
export class TenantModule {}
