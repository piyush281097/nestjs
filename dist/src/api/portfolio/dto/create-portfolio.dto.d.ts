export declare class AddPortfolioName {
    name: string;
}
export declare class listAllPortfolioGroups {
    id: number;
    name: string;
    userId: number;
    isDeleted?: any;
    createdAt: Date;
    lastUpdated: Date;
}
export declare class AddPortfolioWithAsset {
    portfolioGroupId: number;
    assetId: string;
    quantity: number;
    allocation: number;
    price: number;
}
declare const UpdatePortfolioWithAsset_base: import("@nestjs/common").Type<Partial<AddPortfolioWithAsset>>;
export declare class UpdatePortfolioWithAsset extends UpdatePortfolioWithAsset_base {
}
export declare class GetAllPortFolioResponse {
    id: number;
    assetId: string;
    allocation: number;
    price: number;
    quantity: number;
    lastUpdated: Date;
}
export {};
