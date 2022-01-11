import { Strategy } from 'passport-jwt';
export interface DecodedTokenPayload {
    userId: number;
    username: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
export {};
