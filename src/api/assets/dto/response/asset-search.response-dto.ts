import { ApiProperty } from '@nestjs/swagger';

export class AssetSearchResponseDto {
  @ApiProperty()
  symbol: string;

  @ApiProperty()
  exchange: string;

  @ApiProperty()
  exchangeSuffix: string;

  @ApiProperty()
  exchangeName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  iexId?: any;

  @ApiProperty()
  region: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  figi: string;

  @ApiProperty()
  cik: string;

  @ApiProperty()
  lei: string;

  @ApiProperty()
  securityName: string;

  @ApiProperty()
  securityType: string;

  @ApiProperty()
  sector: string;
}
