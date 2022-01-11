import { ApiProperty } from '@nestjs/swagger';

export class AssetListResponseDto {
  @ApiProperty()
  assetId: number;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;
}
