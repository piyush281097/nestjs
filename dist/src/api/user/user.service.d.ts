import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { S3Service } from '../../shared/s3/s3.service';
import { SendgridService } from '../../shared/sendgrid/sendgrid.service';
import { AuthService } from '../auth/auth.service';
import { GetUserByEmailDbDto } from './dto/database/get-user-by-email.db-dto';
import { LoginRequestDto } from './dto/request/login.request-dto';
import { ResetPasswordRequestDto } from './dto/request/reset-password.request-dto';
import { SignupRequestDto } from './dto/request/signup.request-dto';
import { UpdateProfileResponseDto } from './dto/request/update-profile.request-dto';
import { SignupResponseDto } from './dto/response/signup.response-dto';
export declare class UserService {
    private config;
    private db;
    private sendGrid;
    private S3;
    private logger;
    private authService;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, sendGrid: SendgridService, S3: S3Service, logger: Logger, authService: AuthService);
    userSignup(signupRequest: SignupRequestDto): Observable<SignupResponseDto>;
    getUserByEmail(email: string): Observable<GetUserByEmailDbDto>;
    userLogin(loginRequest: LoginRequestDto): Observable<{
        access_token: string;
        user: any;
    }>;
    resendUserVerificationOtp(email: string): Observable<{
        message: string;
    }>;
    verifyAccountOTP(username: string, otp: number): Observable<{
        message: string;
    }>;
    forgotPassword(username: string): Observable<{
        message: string;
    }>;
    validateResetPasswordOTP(username: string, otp: number): Observable<{
        message: string;
    }>;
    resetPassword({ username, otp, password }: ResetPasswordRequestDto): Observable<{
        message: string;
    }>;
    getPreSignedUrlForProfilePicture(fileName: string, userId: number): Observable<{
        filePath: string;
        uploadUrl: string;
    }>;
    updateProfileImageUrls(filePath: string, userId: number): Observable<any>;
    getUserProfileDetails(loggedInUser: number, userId: number): Observable<any>;
    updateIsSignupComplete(userId: number): Observable<{}>;
    updateIsDemoComplete(userId: number): Observable<{}>;
    private sendSignupWelcomeEmailWithOTP;
    searchUsers(query: string): Observable<any[]>;
    updateProfile(userId: number, profile: UpdateProfileResponseDto): Observable<any>;
}
