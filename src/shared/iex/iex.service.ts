import {
  flatMap,
  from,
  last,
  map,
  merge,
  mergeAll,
  mergeMap,
  of,
  toArray,
} from 'rxjs';
import configuration from 'src/config/configuration';
import { Logger } from 'src/shared/logger/logging.service';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

export interface AssetsSearchResponse {
  symbol: string;
  cik: string;
  securityName: string;
  securityType: string;
  region: string;
  exchange: string;
  sector: string;
}
export interface CompanyInfo {
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  CEO: string;
  securityName: string;
  issueType: string;
  sector: string;
  primarySicCode: number;
  employees: number;
  tags: string[];
  address: string;
  address2?: any;
  state: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export interface AssetLogo {
  url: string;
}
@Injectable()
export class IexService {
  private client: any;
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private httpService: HttpService,
    private logger: Logger,
  ) {
    this.logger.setContext(IexService.name);
  }

  searchAssets(searchQuery: string) {
    const searchAssetsUrl = `${this.config.iex.baseUrl}/search/${searchQuery}?token=${this.config.iex.secretKey}`;
    return this.httpService.get<[AssetsSearchResponse]>(searchAssetsUrl).pipe(
      map((res) => res.data),
      // mergeMap((result) =>
      //   // `from` emits each assets separately
      //   from(result.data).pipe(
      //     mergeMap((asset) =>
      //       this.getAssetLogo(asset.symbol).pipe(
      //         map((logo) => ({ ...asset, logo: logo.url })),
      //       ),
      //     ),
      //     toArray(),
      //   ),
      // ),
    );
  }

  getCompanyInfo(symbol: string) {
    const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/company?token=${this.config.iex.secretKey}`;
    return this.httpService.get<CompanyInfo>(searchAssetsUrl).pipe(
      map((res) => res.data),
      mergeMap((asset) =>
        this.getAssetLogo(symbol).pipe(
          map((logo) => ({ ...asset, logo: logo.url })),
        ),
      ),
    );
  }

  getAssetLogo(symbol: string) {
    const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/logo?token=${this.config.iex.secretKey}`;
    return this.httpService
      .get<AssetLogo>(searchAssetsUrl)
      .pipe(map((res) => res.data));
  }

  getAssetFundamentals(symbol: string) {
    const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/quote?&token=${this.config.iex.secretKey}`;
    return this.httpService
      .get<AssetLogo>(searchAssetsUrl)
      .pipe(map((res) => res.data));
  }
}
