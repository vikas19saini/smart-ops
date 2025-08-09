import { TenantDto } from '@common/tenant.dto';
import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { TenantEntity } from './tenant.entity';
import { DatasourceFactoryService } from '@database/datasource.service';

@Injectable()
export class TenantService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly datasourceFactory: DatasourceFactoryService,
  ) {}

  async create(tenantDto: TenantDto): Promise<TenantEntity> {
    const tenantRepo = this.dbService.getRepository(TenantEntity);
    const tenantDetails = await tenantRepo.save(tenantDto);

    const dataSource = await this.datasourceFactory.create({
      tenantId: tenantDetails.id,
      createIfNotExist: true,
    });

    await dataSource.runMigrations();
    await dataSource.destroy();

    return tenantDetails;
  }
}
