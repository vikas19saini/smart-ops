import { BaseEntity } from '@common/base.entity';
import { TenantEntity } from '@modules/tenant/tenant.entity';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/interfaces/role.type';
import { UserStatus } from 'src/interfaces/user.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column()
  type: UserRole;

  @Column()
  status: UserStatus;

  @Column({ name: 'tenant_id' })
  tenantId: Number;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;
}
