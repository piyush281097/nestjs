import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
}
export interface GetUserCoreByEmail {
    id: string;
    isSocialLogin: boolean;
}
export interface GoogleLoginResponse {
    user: User;
}
export declare class SocialLoginService {
    private config;
    private db;
    private logger;
    private authService;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger, authService: AuthService);
    googleLogin(req: GoogleLoginResponse): "No user from google" | import("rxjs").Observable<{
        access_token: string;
        user: any;
    }>;
}
