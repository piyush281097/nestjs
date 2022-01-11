export declare class Timeline {
    to: string;
    from: string;
    activity: string;
    investorName: string;
}
export declare class UpdateProfileResponseDto {
    userHandle?: string;
    experienceLevel: number;
    firstName: string;
    lastName: string;
    quote: string;
    about: string;
    goal: [string];
    timeline: Timeline[];
    investmentStyle: number[];
    interest: number[];
}
