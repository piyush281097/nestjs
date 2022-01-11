import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { CityFalconService } from '../../shared/city-falcon/city-falcon.service';
import { IexService } from '../../shared/iex/iex.service';
export declare class AssetsService {
    private db;
    private iex;
    private cityFalcon;
    private logger;
    constructor(db: DatabaseService<any>, iex: IexService, cityFalcon: CityFalconService, logger: Logger);
    getAssetDetails(searchQuery: string): import("rxjs").Observable<[import("../../shared/iex/iex.service").AssetsSearchResponse]>;
    getAssetLogo(symbol: string): import("rxjs").Observable<import("../../shared/iex/iex.service").AssetLogo>;
    searchAssetsFromDb(query: string): import("rxjs").Observable<any[]>;
    getCompanyInfo(symbol: string): import("rxjs").Observable<{
        logo: string;
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
    }>;
    getCompanyFundamentals(symbol: string): import("rxjs").Observable<import("../../shared/iex/iex.service").AssetLogo>;
    getCompanyNews(symbol: string): import("rxjs").Observable<any>;
}
