import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddCommentOnTradeRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @ApiProperty({
    description: 'Array of tagged users ID',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  taggedUsers: number[];

  @IsOptional()
  @ApiProperty({
    description: 'Hashtags as array of strings',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Asset symbols as array of strings',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  taggedAssets: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}
