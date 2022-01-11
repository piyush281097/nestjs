"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth-guard");
const forgot_password_request_dto_1 = require("./dto/request/forgot-password.request-dto");
const login_request_dto_1 = require("./dto/request/login.request-dto");
const profile_image_update_url_request_dto_1 = require("./dto/request/profile-image-update-url.request-dto");
const resend_otp_signup_request_dto_1 = require("./dto/request/resend-otp-signup.request-dto");
const reset_password_request_dto_1 = require("./dto/request/reset-password.request-dto");
const signup_request_dto_1 = require("./dto/request/signup.request-dto");
const update_profile_request_dto_1 = require("./dto/request/update-profile.request-dto");
const upload_profile_image_request_dto_1 = require("./dto/request/upload-profile-image.request-dto");
const validate_reset_password_otp_request_dto_1 = require("./dto/request/validate-reset-password-otp.request-dto");
const verify_account_otp_request_dto_1 = require("./dto/request/verify-account-otp.request-dto");
const forgot_password_response_dto_1 = require("./dto/response/forgot-password.response-dto");
const get_profile_details_response_dto_1 = require("./dto/response/get-profile-details.response-dto");
const login_response_dto_1 = require("./dto/response/login.response-dto");
const profile_image_update_url_response_dto_1 = require("./dto/response/profile-image-update-url.response-dto");
const resend_otp_signup_request_dto_2 = require("./dto/response/resend-otp-signup.request-dto");
const reset_password_response_dto_1 = require("./dto/response/reset-password.response-dto");
const search_users_response_dto_1 = require("./dto/response/search-users.response-dto");
const signup_response_dto_1 = require("./dto/response/signup.response-dto");
const upload_profile_image_response_dto_1 = require("./dto/response/upload-profile-image.response-dto");
const validate_reset_password_otp_response_dto_1 = require("./dto/response/validate-reset-password-otp.response-dto");
const verify_account_otp_request_dto_2 = require("./dto/response/verify-account-otp.request-dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    CreateUser(signupRequest) {
        return this.userService.userSignup(signupRequest);
    }
    UserLogin(loginRequest) {
        return this.userService.userLogin(loginRequest);
    }
    ResendSignupVerificationOTP(otpRequest) {
        return this.userService.resendUserVerificationOtp(otpRequest.username);
    }
    VerifySignupOTP(body) {
        return this.userService.verifyAccountOTP(body.username, body.otp);
    }
    ForgotPassword(body) {
        return this.userService.forgotPassword(body.username);
    }
    ValidateResetPasswordOtp(body) {
        return this.userService.validateResetPasswordOTP(body.username, body.otp);
    }
    ResetPassword(body) {
        const { otp, password, username } = body;
        return this.userService.resetPassword({
            otp,
            password,
            username,
        });
    }
    GetPreSignedUrlForProfilePicture(user, body) {
        return this.userService.getPreSignedUrlForProfilePicture(body.fileName, user.userId);
    }
    UpdateProfilePictureURL(user, body) {
        return this.userService.updateProfileImageUrls(body.filePath, user.userId);
    }
    GetUserProfileDetails(user) {
        return this.userService.getUserProfileDetails(user.userId, user.userId);
    }
    GetUserProfileDetailsOfOtherUser(user, userId) {
        return this.userService.getUserProfileDetails(user.userId, userId);
    }
    UpdateUserProfileDetails(user, profile) {
        return this.userService.updateProfile(user.userId, profile);
    }
    UpdateIsSignupComplete(user) {
        return this.userService.updateIsSignupComplete(user.userId);
    }
    UpdateIsDemoComplete(user) {
        return this.userService.updateIsDemoComplete(user.userId);
    }
    SearchUsers(user, query) {
        return this.userService.searchUsers(query);
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: signup_request_dto_1.SignupRequestDto }),
    (0, swagger_1.ApiResponse)({ type: signup_response_dto_1.SignupResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_request_dto_1.SignupRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "CreateUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: login_request_dto_1.LoginRequestDto }),
    (0, swagger_1.ApiResponse)({ type: login_response_dto_1.LoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_request_dto_1.LoginRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "UserLogin", null);
__decorate([
    (0, common_1.Post)('resend-signup-verification-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'To resend signup verification OTP via email' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: resend_otp_signup_request_dto_1.ResendOtpSignupRequestDto }),
    (0, swagger_1.ApiResponse)({ type: resend_otp_signup_request_dto_2.ResendOtpSignupResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_signup_request_dto_1.ResendOtpSignupRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "ResendSignupVerificationOTP", null);
__decorate([
    (0, common_1.Post)('verify-signup-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'To mark the user account as verified by verifying otp',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: verify_account_otp_request_dto_1.VerifyAccountOtpRequestDto }),
    (0, swagger_1.ApiResponse)({ type: verify_account_otp_request_dto_2.VerifyAccountOtpResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_account_otp_request_dto_1.VerifyAccountOtpRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "VerifySignupOTP", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate and will sent OTP to the given email address',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: forgot_password_request_dto_1.ForgotPasswordRequestDto }),
    (0, swagger_1.ApiResponse)({ type: forgot_password_response_dto_1.ForgotPasswordResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_request_dto_1.ForgotPasswordRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "ForgotPassword", null);
__decorate([
    (0, common_1.Post)('validate-reset-password-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'To check OTP is correct or not. NOT TO MARK AS VERIFIED',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: validate_reset_password_otp_request_dto_1.ValidateResetPasswordOtpRequestDto }),
    (0, swagger_1.ApiResponse)({ type: validate_reset_password_otp_response_dto_1.ValidateResetPasswordOtpResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_reset_password_otp_request_dto_1.ValidateResetPasswordOtpRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "ValidateResetPasswordOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'To verify OTP and to update new password',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, swagger_1.ApiBody)({ type: reset_password_request_dto_1.ResetPasswordRequestDto }),
    (0, swagger_1.ApiResponse)({ type: reset_password_response_dto_1.ResetPasswordResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_request_dto_1.ResetPasswordRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "ResetPassword", null);
__decorate([
    (0, common_1.Post)('profile-picture'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'This will generate presigned S3 URL for profile picture',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: upload_profile_image_request_dto_1.UploadProfileImageRequestDto }),
    (0, swagger_1.ApiResponse)({ type: upload_profile_image_response_dto_1.UploadProfileImageResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_profile_image_request_dto_1.UploadProfileImageRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "GetPreSignedUrlForProfilePicture", null);
__decorate([
    (0, common_1.Put)('profile-picture'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Pass the "filePath" from POST /profile-picture API response in order to update the image url in database',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiBody)({ type: profile_image_update_url_request_dto_1.ProfileImageUpdateUrlRequestDto }),
    (0, swagger_1.ApiResponse)({ type: profile_image_update_url_response_dto_1.ProfileImageUpdateUrlResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_image_update_url_request_dto_1.ProfileImageUpdateUrlRequestDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "UpdateProfilePictureURL", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User Profile of the logged in person',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: get_profile_details_response_dto_1.GetProfileDetailsResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "GetUserProfileDetails", null);
__decorate([
    (0, common_1.Get)('details/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User Profile of the other user',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: get_profile_details_response_dto_1.GetProfileDetailsResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "GetUserProfileDetailsOfOtherUser", null);
__decorate([
    (0, common_1.Patch)('details'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({})),
    (0, swagger_1.ApiOperation)({
        summary: 'Update User Profile of the logged in person',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: update_profile_request_dto_1.UpdateProfileResponseDto }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_request_dto_1.UpdateProfileResponseDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "UpdateUserProfileDetails", null);
__decorate([
    (0, common_1.Put)('is-signup-complete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Flag to update after initial screens are shown',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ type: Object }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "UpdateIsSignupComplete", null);
__decorate([
    (0, common_1.Put)('is-demo-complete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Flag to update after demo screens are shown',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ type: Object }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "UpdateIsDemoComplete", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search user by username or handle',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', description: 'Username or User handle' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBody)({ type: [search_users_response_dto_1.SearchUsersResponseDto] }),
    __param(0, (0, user_token_payload_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "SearchUsers", null);
UserController = __decorate([
    (0, common_1.Controller)({
        path: 'user',
        version: '1',
    }),
    (0, swagger_1.ApiTags)('User'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map