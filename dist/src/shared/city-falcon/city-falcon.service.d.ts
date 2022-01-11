import configuration from 'src/config/configuration';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Logger } from '../logger/logging.service';
export declare class CityFalconService {
    private config;
    private httpService;
    private logger;
    private client;
    constructor(config: ConfigType<typeof configuration>, httpService: HttpService, logger: Logger);
    getAssetNews(symbol: string): import("rxjs").Observable<any>;
}
