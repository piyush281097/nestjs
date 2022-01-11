import { map } from 'rxjs';
import configuration from 'src/config/configuration';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Logger } from '../logger/logging.service';

@Injectable()
export class CityFalconService {
  private client: any;
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private httpService: HttpService,
    private logger: Logger,
  ) {
    this.logger.setContext(CityFalconService.name);
  }

  getAssetNews(symbol: string) {
    const searchAssetsUrl = `${this.config.cityFalcon.baseUrl}/v0.2/stories?identifier_type=assets&identifiers=${symbol}&time_filter=d1&categories=mp%2Cop&min_cityfalcon_score=0&order_by=top&access_token=${this.config.cityFalcon.apiKey}`;
    return this.httpService
      .get<any>(searchAssetsUrl)
      .pipe(map((res) => res.data));
  }
}
