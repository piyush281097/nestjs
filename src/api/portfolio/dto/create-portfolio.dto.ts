import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

export class AddPortfolioName {
  @ApiProperty()
  @IsString()
  name: string;
}

export class listAllPortfolioGroups {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  isDeleted?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUpdated: Date;
}

export class AddPortfolioWithAsset {
  @ApiProperty({
    description: 'Portfolio group ID',
    required: true,
  })
  @IsNumber()
  portfolioGroupId: number;

  @ApiProperty({
    description: 'Asset SYMBOL NAME',
    required: true,
  })
  @IsString()
  assetId: string;

  @ApiProperty({ description: 'Quantity of stock that purchased' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Allocation of stock quantity' })
  @IsNotEmpty()
  @IsNumber()
  allocation: number;

  @ApiProperty({ description: 'Price at which asset purchased' })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdatePortfolioWithAsset extends PartialType(
  AddPortfolioWithAsset,
) {}

export class GetAllPortFolioResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  assetId: string;

  @ApiProperty()
  allocation: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  lastUpdated: Date;
}
