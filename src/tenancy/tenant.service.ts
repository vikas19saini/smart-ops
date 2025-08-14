import { DatabaseService } from '@database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { TenantEntity } from './tenant.entity';
import { DatasourceFactoryService } from '@database/datasource.service';
import { TenantDto } from './tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly datasourceFactory: DatasourceFactoryService,
  ) {}

  async create(tenantDto: TenantDto): Promise<TenantEntity> {
    const tenantRepo = this.dbService.getRepository(TenantEntity);

    const isTenantExist = await tenantRepo.exists({
      where: { domain: tenantDto.domain },
    });

    if (isTenantExist)
      throw new ConflictException(
        `Tenant with ${tenantDto.domain} domain name already exist!`,
      );

    const tenantDetails = await tenantRepo.save(tenantDto);

    const dataSource = await this.datasourceFactory.create({
      tenantId: tenantDetails.id,
      createIfNotExist: true,
    });

    await dataSource.runMigrations();
    await dataSource.destroy();
    await this.dbService.createTenantConnection(String(tenantDetails.id));

    return tenantDetails;
  }
}
