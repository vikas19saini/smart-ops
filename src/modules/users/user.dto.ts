import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@interfaces/role.type';
import { UserStatus } from '@interfaces/user.type';

export class UserDto {
  @IsEmail()
  email: string;

  firstName: string;

  lastName: string;

  @IsNotEmpty()
  @Exclude()
  password: string;

  phone: string;

  @IsEnum(UserRole)
  type: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  tenantId: Number;
}
