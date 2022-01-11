import configuration from 'src/config/configuration';
import { Logger } from 'src/shared/logger/logging.service';
import { HttpService } from '@nestjs/axios';
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
export declare class IexService {
    private config;
    private httpService;
    private logger;
    private client;
    constructor(config: ConfigType<typeof configuration>, httpService: HttpService, logger: Logger);
    searchAssets(searchQuery: string): import("rxjs").Observable<[AssetsSearchResponse]>;
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
    getAssetLogo(symbol: string): import("rxjs").Observable<AssetLogo>;
    getAssetFundamentals(symbol: string): import("rxjs").Observable<AssetLogo>;
}
