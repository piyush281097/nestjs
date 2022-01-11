import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { AddPortfolioWithAsset, UpdatePortfolioWithAsset } from './dto/create-portfolio.dto';
export declare class PortfolioService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    create(userId: number, name: string): import("rxjs").Observable<any[]>;
    findAll(userId: number, query?: string): import("rxjs").Observable<any[]>;
    update(userId: number, id: number, name: string): import("rxjs").Observable<any[]>;
    remove(userId: number, id: number): import("rxjs").Observable<any>;
    addPortfolio(userId: number, portfolio: AddPortfolioWithAsset): import("rxjs").Observable<any[]>;
    findAllPortfolioOfaGroup(userId: number, portfolioGroupId: number): import("rxjs").Observable<any[]>;
    updatePortfolio(userId: number, portfolioId: number, portfolio: UpdatePortfolioWithAsset): import("rxjs").Observable<any[]>;
    removePortfolio(userId: number, id: number): import("rxjs").Observable<any>;
}
