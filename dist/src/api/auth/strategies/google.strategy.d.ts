import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import configuration from 'src/config/configuration';
import { ConfigType } from '@nestjs/config';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private config;
    constructor(config: ConfigType<typeof configuration>);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
