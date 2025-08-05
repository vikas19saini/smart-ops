import { TenantDto } from '@common/tenant.dto';
import { UserDto } from '@modules/users/user.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class SignupDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmpty()
  company: TenantDto;
}
