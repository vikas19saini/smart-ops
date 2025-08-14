import { Public } from '@common/auth.decorator';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantDto } from './tenant.dto';

@Public()
@Controller('tenant')
export class TenantController {
  private readonly logger = new Logger(TenantController.name);
  constructor(private readonly tenantService: TenantService) {}

  @Post('/')
  async create(@Body() tenant: TenantDto) {
    try {
      if (!(await this.tenantService.isValidTenant(tenant.domain)))
        throw new ConflictException(
          `Tenant with ${tenant.domain} domain name already exist!`,
        );

      return await this.tenantService.create(tenant);
    } catch (err) {
      this.logger.error('Tenant create error: ', err);
    }
  }

  @Get('/')
  async search(@Query('domain') domain: string) {
    return await this.tenantService.searchByDomainName(domain);
  }
}
