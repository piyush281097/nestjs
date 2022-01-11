import { SocialLoginService } from './social-login.service';
export declare class SocialLoginController {
    private readonly socialLoginService;
    constructor(socialLoginService: SocialLoginService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): "No user from google" | import("rxjs").Observable<{
        access_token: string;
        user: any;
    }>;
}
