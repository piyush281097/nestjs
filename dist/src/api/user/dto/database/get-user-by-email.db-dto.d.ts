export declare class GetUserByEmailDbDto {
    id: number;
    email: string;
    password: string;
    passwordSalt: string;
    isVerified: string;
    isActive: string;
    userHandle: string;
    countryCode: string;
    mobileNumber: string;
    isDeleted: string;
    createdAt: string;
    lastUpdated: string;
    userId: number;
    firstName: string;
    lastName: number;
    quote: string;
    about: string;
    goal: string;
    isSocialLogin: boolean;
}
declare const GetUserByEmailWithPassword_base: import("@nestjs/common").Type<Omit<GetUserByEmailDbDto, "password" | "passwordSalt">>;
export declare class GetUserByEmailWithPassword extends GetUserByEmailWithPassword_base {
}
export {};
