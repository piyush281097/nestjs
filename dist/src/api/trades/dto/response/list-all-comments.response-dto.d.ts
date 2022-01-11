export declare class CreatedBy {
    userId: number;
    lastName: string;
    firstName: string;
    userHandle: string;
}
export declare class TaggedAsset {
    logo: string;
    name: string;
    symbol: string;
    assetId: number;
}
export declare class TaggedUser {
    userId: number;
    lastName: string;
    firstName: string;
    userHandle: string;
}
export declare class ListAllCommentsOnTradesResponseDtoTemp {
    tradeId: number;
    content: string;
    isLiked: boolean;
    likes: number;
    createdBy: CreatedBy;
    taggedAssets: TaggedAsset[];
    taggedUsers: TaggedUser[];
}
export declare class ListAllCommentsOnTradesResponseDto extends ListAllCommentsOnTradesResponseDtoTemp {
    replies: ListAllCommentsOnTradesResponseDtoTemp[];
}
