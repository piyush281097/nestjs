import { Type } from 'class-transformer';
import { IsNotIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListAllFollowersQueryDto {
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
}
