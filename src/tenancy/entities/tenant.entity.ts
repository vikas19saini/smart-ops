import { BaseEntity } from '@common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenants')
export class TenantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  name: string;

  @Column()
  domain: string;

  @Column()
  status: Number;
}
