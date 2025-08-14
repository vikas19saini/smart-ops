import { BaseEntity } from '@common/base.entity';

import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/interfaces/role.type';
import { UserStatus } from 'src/interfaces/user.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  email: string;

  @Expose()
  @Column()
  username: string;

  @Expose()
  @Column({ name: 'first_name' })
  firstName: string;

  @Expose()
  @Column({ name: 'last_name' })
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  @Column()
  phone: string;

  @Expose()
  @Column()
  type: UserRole;

  @Expose()
  @Column()
  status: UserStatus;
}
