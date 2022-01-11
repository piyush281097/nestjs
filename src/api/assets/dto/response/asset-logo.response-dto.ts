import { ApiProperty } from '@nestjs/swagger';

export class AssetLogoResponseDto {
  @ApiProperty()
  url: string;
}
export class AssetDetailsDto {
  @ApiProperty()
  symbol: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  exchange: string;

  @ApiProperty()
  industry: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  CEO: string;

  @ApiProperty()
  securityName: string;

  @ApiProperty()
  issueType: string;

  @ApiProperty()
  sector: string;

  @ApiProperty()
  primarySicCode: number;

  @ApiProperty()
  employees: number;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  address: string;

  @ApiProperty()
  address2?: any;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zip: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  logo: string;
}

export class AssetFundamentalsDto {
  @ApiProperty()
  avgTotalVolume: number;

  @ApiProperty()
  calculationPrice: string;

  @ApiProperty()
  change: number;

  @ApiProperty()
  changePercent: number;

  @ApiProperty()
  close?: any;

  @ApiProperty()
  closeSource: string;

  @ApiProperty()
  closeTime?: any;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  delayedPrice?: any;

  @ApiProperty()
  delayedPriceTime?: any;

  @ApiProperty()
  extendedChange?: any;

  @ApiProperty()
  extendedChangePercent?: any;

  @ApiProperty()
  extendedPrice?: any;

  @ApiProperty()
  extendedPriceTime?: any;

  @ApiProperty()
  high: number;

  @ApiProperty()
  highSource: string;

  @ApiProperty()
  highTime: number;

  @ApiProperty()
  iexAskPrice: number;

  @ApiProperty()
  iexAskSize: number;

  @ApiProperty()
  iexBidPrice: number;

  @ApiProperty()
  iexBidSize: number;

  @ApiProperty()
  iexClose: number;

  @ApiProperty()
  iexCloseTime: number;

  @ApiProperty()
  iexLastUpdated: number;

  @ApiProperty()
  iexMarketPercent: number;

  @ApiProperty()
  iexOpen: number;

  @ApiProperty()
  iexOpenTime: number;

  @ApiProperty()
  iexRealtimePrice: number;

  @ApiProperty()
  iexRealtimeSize: number;

  @ApiProperty()
  iexVolume: number;

  @ApiProperty()
  lastTradeTime: number;

  @ApiProperty()
  latestPrice: number;

  @ApiProperty()
  latestSource: string;

  @ApiProperty()
  latestTime: string;

  @ApiProperty()
  latestUpdate: number;

  @ApiProperty()
  latestVolume: number;

  @ApiProperty()
  low: number;

  @ApiProperty()
  lowSource: string;

  @ApiProperty()
  lowTime: number;

  @ApiProperty()
  marketCap: number;

  @ApiProperty()
  oddLotDelayedPrice?: any;

  @ApiProperty()
  oddLotDelayedPriceTime?: any;

  @ApiProperty()
  open?: any;

  @ApiProperty()
  openTime?: any;

  @ApiProperty()
  openSource: string;

  @ApiProperty()
  peRatio: number;

  @ApiProperty()
  previousClose: number;

  @ApiProperty()
  previousVolume: number;

  @ApiProperty()
  primaryExchange: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  volume: number;

  @ApiProperty()
  week52High: number;

  @ApiProperty()
  week52Low: number;

  @ApiProperty()
  ytdChange: number;

  @ApiProperty()
  isUSMarketOpen: boolean;
}
