import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListAllPostsQueryDto {
  @Type(() => Number)
  @IsNumber()
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
