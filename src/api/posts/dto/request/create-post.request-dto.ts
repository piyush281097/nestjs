import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePostRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  sharedPostId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @ApiProperty({
    description:
      'Original image URL that being returned from the generatePresignedUrl API',
  })
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Array of tagged users ID',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  // @ArrayUnique((o: any) => o)
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
}
