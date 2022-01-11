declare class User {
    email: string;
    isVerified: boolean;
    isActive: boolean;
    userHandle?: any;
    countryCode: string;
    mobileNumber: string;
    isDeleted?: any;
    createdAt: Date;
    lastUpdated: Date;
    userId: number;
    firstName: string;
    lastName: string;
    quote?: string;
    about?: string;
    goal?: string;
}
export declare class LoginResponseDto {
    access_token: string;
    user: User;
}
export {};
