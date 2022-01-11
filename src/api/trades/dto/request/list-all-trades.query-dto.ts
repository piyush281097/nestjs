import { Type } from 'class-transformer';
import { IsIn, IsNotIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListAllTradesQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotIn([0])
  @IsOptional()
  limit?: number = 8;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset?: number = 0;

  @IsString()
  @IsOptional()
  sort?: string = 'latest'; //Default value

  @IsOptional()
  @IsString()
  @IsIn(['all', 'one_day', 'one_week', 'one_month'])
  filter?: string = 'all'; //Default value
}
