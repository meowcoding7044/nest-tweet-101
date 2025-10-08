import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, IsInt } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  @Min(1)
  page: number = 1;
}
