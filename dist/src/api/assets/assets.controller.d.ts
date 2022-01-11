import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    AssetSearch(query: string): import("rxjs").Observable<[import("../../shared/iex/iex.service").AssetsSearchResponse]>;
    GetAssetLogo(symbol: string): import("rxjs").Observable<import("../../shared/iex/iex.service").AssetLogo>;
    GetCompanyDetails(symbol: string): import("rxjs").Observable<{
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
    GetCompanyFundamentals(symbol: string): import("rxjs").Observable<import("../../shared/iex/iex.service").AssetLogo>;
    GetCompanyNews(symbol: string): import("rxjs").Observable<any>;
}
