import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@interfaces/role.type';
import { UserStatus } from '@interfaces/user.type';
import { Expose } from 'class-transformer';

class UserBaseDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsOptional()
  firstName: string;

  @Expose()
  @IsOptional()
  lastName: string;

  @Expose()
  @IsEnum(UserRole)
  type: UserRole;

  @Expose()
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class UserDto extends UserBaseDto {
  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;
}

export class UserResponseDto extends UserBaseDto {
  @Expose()
  id: number;

  @Expose()
  phone: string;
}
