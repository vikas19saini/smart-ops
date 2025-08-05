import { Public } from '@common/auth.decorator';
import { TenantDto } from '@common/tenant.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Public()
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/')
  async create(@Body() tenant: TenantDto) {
    return await this.tenantService.create(tenant);
  }
}
