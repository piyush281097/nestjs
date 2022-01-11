export declare class UserFollowDto {
    userId: number;
    lastName: string;
    firstName: string;
    userHandle: string;
}
export declare class ProfileImage {
    imageOrg: string;
    imageThumb: string;
    imageSmall: string;
    imageMedium: string;
    imageLarge: string;
}
export declare class ListOfFollowersDto {
    following: UserFollowDto[];
    followers: UserFollowDto[];
    profileImage: ProfileImage;
}
