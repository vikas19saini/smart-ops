import { JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { TenantEntity } from '@modules/tenant/tenant.entity';

export abstract class BaseEntityWithTenant extends BaseEntity {
  @JoinColumn({ name: 'tenant_id' })
  @ManyToOne(() => TenantEntity, { eager: false })
  tenant: TenantEntity;
}
