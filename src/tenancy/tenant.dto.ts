import { IsNotEmpty } from 'class-validator';

export class TenantDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domain: string;
}
