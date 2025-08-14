import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@interfaces/role.type';
import { UserStatus } from '@interfaces/user.type';
import { Expose } from 'class-transformer';

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsEnum(UserRole)
  type: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;
}
