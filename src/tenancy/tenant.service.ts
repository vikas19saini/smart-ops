import { DatabaseService } from '@database/database.service';
import { Injectable, Logger } from '@nestjs/common';
import { TenantEntity } from './tenant.entity';
import { DatasourceFactoryService } from '@database/datasource.service';
import { TenantDto } from './tenant.dto';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);
  constructor(
    private readonly dbService: DatabaseService,
    private readonly datasourceFactory: DatasourceFactoryService,
  ) {}

  private getTenentRepo() {
    return this.dbService.getRepository(TenantEntity);
  }

  async searchByDomainName(domain: string) {
    try {
      const tenantRepo = this.dbService.getRepository(TenantEntity);
      return await tenantRepo.findOneBy({ domain });
    } catch (err) {
      this.logger.error(`Tenant search by domain name ${domain}`, err);
      throw err;
    }
  }

  async getTenantBuyDomain(domain: string): Promise<TenantEntity | null> {
    try {
      const tenantRepo = this.getTenentRepo();
      return await tenantRepo.findOneBy({ domain });
    } catch (err) {
      this.logger.error(`Error fetching tenant by domain ${domain}`, err);
      throw err;
    }
  }

  async create(tenantDto: TenantDto): Promise<TenantEntity> {
    const tenantRepo = this.getTenentRepo();

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
