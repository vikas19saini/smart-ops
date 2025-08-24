import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  @Type(() => Number)
  skip: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  take: number;
}
