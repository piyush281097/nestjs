import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddRecentSearchRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  assetId: string;
}

export class listRecentSearchItemDto {
  @ApiProperty()
  @IsString()
  @IsIn(['user', 'asset'])
  type: string;
}
