export declare class ProfileImage {
    imageOrg: string;
    imageThumb: string;
    imageSmall: string;
    imageMedium: string;
    imageLarge: string;
}
export declare class Timeline {
    to: string;
    from: string;
    activity: string;
    investorName: string;
}
export declare class InvestmentStyle {
    id: number;
    type: string;
}
export declare class Interest {
    id: number;
    type: string;
}
export declare class GetProfileDetailsResponseDto {
    userId: number;
    email: string;
    isVerified: boolean;
    isActive: boolean;
    followingCount: number;
    followersCount: number;
    isFollowing: boolean;
    isBeingFollowed: boolean;
    userHandle?: string;
    experienceLevel?: string;
    isSignupComplete: boolean;
    countryCode: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    quote?: string;
    about?: string;
    goal?: string;
    profileImage: ProfileImage;
    timeline: Timeline[];
    investmentStyle: InvestmentStyle[];
    interest: Interest[];
}
