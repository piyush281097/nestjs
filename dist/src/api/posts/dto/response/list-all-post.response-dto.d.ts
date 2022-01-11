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
export declare class MediaUrl {
    imageOrg: string;
    imageLarge: string;
    imageSmall: string;
    imageThumb: string;
    imageMedium: string;
}
export declare class ProfileImage {
    imageOrg: string;
    imageThumb: string;
    imageSmall: string;
    imageMedium: string;
    imageLarge: string;
}
export declare class ListAllPostsResponseDtoTemp {
    postId: number;
    content: string;
    isLiked: boolean;
    likes: number;
    createdBy: CreatedBy;
    taggedAssets: TaggedAsset[];
    taggedUsers: TaggedUser[];
    mediaUrl: MediaUrl[];
    profileImage: ProfileImage;
}
export declare class ListAllPostsResponseDto extends ListAllPostsResponseDtoTemp {
    postShared: ListAllPostsResponseDtoTemp;
}
