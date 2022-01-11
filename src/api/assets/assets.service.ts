import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';

import { Injectable } from '@nestjs/common';

import { CityFalconService } from '../../shared/city-falcon/city-falcon.service';
import { IexService } from '../../shared/iex/iex.service';
import { searchAssetDbQuery } from './db-query/search-assets.db-query';

@Injectable()
export class AssetsService {
  constructor(
    private db: DatabaseService<any>,
    private iex: IexService,
    private cityFalcon: CityFalconService,
    private logger: Logger,
  ) {
    this.logger.setContext(AssetsService.name);
  }

  getAssetDetails(searchQuery: string) {
    return this.iex.searchAssets(searchQuery);
  }

  getAssetLogo(symbol: string) {
    return this.iex.getAssetLogo(symbol);
  }

  searchAssetsFromDb(query: string) {
    return this.db.rawQuery(searchAssetDbQuery, [`${query}%`], null);
  }

  getCompanyInfo(symbol: string) {
    return this.iex.getCompanyInfo(symbol);
  }

  getCompanyFundamentals(symbol: string) {
    return this.iex.getAssetFundamentals(symbol);
  }

  getCompanyNews(symbol: string) {
    return this.cityFalcon.getAssetNews(symbol);
  }
}
