import { BaseEntity } from '@common/base.entity';

import { Exclude } from 'class-transformer';
import { UserRole } from 'src/interfaces/role.type';
import { UserStatus } from 'src/interfaces/user.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
