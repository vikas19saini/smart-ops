import { IsNotEmpty } from 'class-validator';

export class TenantDto {
  @IsNotEmpty()
  name: string;

  address: string;
  city: string;
  state: string;
  country: string;
  gstin: string;
}
