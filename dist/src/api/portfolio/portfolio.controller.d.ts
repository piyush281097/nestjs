import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { AddPortfolioName, AddPortfolioWithAsset, UpdatePortfolioWithAsset } from './dto/create-portfolio.dto';
import { PortfolioService } from './portfolio.service';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    create(user: DecodedTokenPayload, createPostDto: AddPortfolioName): import("rxjs").Observable<any[]>;
    findAll(user: DecodedTokenPayload, query: string): import("rxjs").Observable<any[]>;
    update(user: DecodedTokenPayload, groupId: number, body: AddPortfolioName): import("rxjs").Observable<any[]>;
    remove(user: DecodedTokenPayload, groupId: number): import("rxjs").Observable<any>;
    createPortfolio(user: DecodedTokenPayload, portfolio: AddPortfolioWithAsset): import("rxjs").Observable<any[]>;
    listPortfolioByGroup(user: DecodedTokenPayload, portfolioGroupId: number): import("rxjs").Observable<any[]>;
    PatchPortfolioItem(user: DecodedTokenPayload, portfolioId: number, body: UpdatePortfolioWithAsset): import("rxjs").Observable<any[]>;
    DeletePortfolioItem(user: DecodedTokenPayload, groupId: number): import("rxjs").Observable<any>;
}
