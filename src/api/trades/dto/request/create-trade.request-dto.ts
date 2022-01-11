import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['buy', 'sell'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Quantity of stock that purchased' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price at which asset purchased' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @ApiProperty({
    description: 'Purchased/Sold asset SYMBOL NAME',
    required: true,
  })
  @IsString()
  assetId: string;
}
