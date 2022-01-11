import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddCommentOnPostRequestDto {
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
    description: 'Array of tagged Assets ID',
    required: false,
    type: [String],
  })
  @IsArray()
  // @ArrayUnique((o: CreatePostRequestDto) => o)
  taggedAssets: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}
