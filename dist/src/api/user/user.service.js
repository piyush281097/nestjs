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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const constants_1 = require("../../shared/constants");
const logging_service_1 = require("../../shared/logger/logging.service");
const common_1 = require("@nestjs/common");
const constants_2 = require("../../shared/constants");
const s3_service_1 = require("../../shared/s3/s3.service");
const sendgrid_service_1 = require("../../shared/sendgrid/sendgrid.service");
const utils_service_1 = require("../../utils/utils.service");
const auth_service_1 = require("../auth/auth.service");
const add_otp_for_user_db_query_1 = require("./db-query/add-otp-for-user.db-query");
const add_user_db_query_1 = require("./db-query/add-user.db-query");
const get_otp_by_email_db_query_1 = require("./db-query/get-otp-by-email.db-query");
const get_profile_details_db_query_1 = require("./db-query/get-profile-details.db-query");
const get_user_by_email_db_query_1 = require("./db-query/get-user-by-email.db-query");
const reset_password_db_query_1 = require("./db-query/reset-password.db-query");
const search_users_db_query_1 = require("./db-query/search-users.db-query");
const update_profile_image_db_query_1 = require("./db-query/update-profile-image.db-query");
const update_user_demo_complete_bool_db_query_1 = require("./db-query/update-user-demo-complete-bool.db-query");
const update_user_signup_complete_bool_db_query_1 = require("./db-query/update-user-signup-complete-bool.db-query");
const verify_user_otp_and_account_db_query_1 = require("./db-query/verify-user-otp-and-account.db-query");
const get_otp_by_email_db_dto_1 = require("./dto/database/get-otp-by-email.db-dto");
const get_user_by_email_db_dto_1 = require("./dto/database/get-user-by-email.db-dto");
const user_create_return_db_dto_1 = require("./dto/database/user-create-return.db-dto");
const get_profile_details_response_dto_1 = require("./dto/response/get-profile-details.response-dto");
const search_users_response_dto_1 = require("./dto/response/search-users.response-dto");
const welcome_verify_otp_1 = require("./templates/welcome_verify_otp");
let UserService = UserService_1 = class UserService {
    constructor(config, db, sendGrid, S3, logger, authService) {
        this.config = config;
        this.db = db;
        this.sendGrid = sendGrid;
        this.S3 = S3;
        this.logger = logger;
        this.authService = authService;
        this.logger.setContext(UserService_1.name);
    }
    userSignup(signupRequest) {
        const { email, password, countryCode, firstName, lastName, phoneNumber } = signupRequest;
        const otp = Math.floor(Math.random() * 90000) + 10000;
        return (0, rxjs_1.forkJoin)({
            password: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(password, this.config.saltRounds)),
            otp: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)),
        }).pipe((0, rxjs_1.switchMap)(({ password, otp }) => {
            const userHandleTail = Math.floor(Math.random() * 90000) + 10000;
            const userHandle = signupRequest.userHandle
                ? signupRequest.userHandle
                : `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();
            return this.db.rawQuery(add_user_db_query_1.addUserDbQuery, [
                email,
                password.hashedPassword,
                password.passwordSalt,
                countryCode,
                phoneNumber,
                firstName,
                lastName,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.new_signup,
                otp.hashedPassword,
                userHandle,
            ], user_create_return_db_dto_1.UserCreateReturnDto);
        }), (0, rxjs_1.switchMap)((userId) => {
            return this.sendSignupWelcomeEmailWithOTP(email, userId[0].userId, otp).pipe((0, rxjs_1.map)(() => {
                return {
                    message: 'Signup Success. Please check your email',
                };
            }));
        }));
    }
    getUserByEmail(email) {
        return this.db
            .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }));
    }
    userLogin(loginRequest) {
        return this.authService.validateUser(loginRequest).pipe((0, rxjs_1.map)((userData) => {
            if (!userData) {
                throw new common_1.UnauthorizedException('Invalid Email or Password');
            }
            if (!userData.isVerified) {
                throw new common_1.ForbiddenException('Email is not verified');
            }
            return this.authService.login(userData);
        }));
    }
    resendUserVerificationOtp(email) {
        return this.getUserByEmail(email).pipe((0, rxjs_1.switchMap)((user) => {
            if (!user) {
                throw new common_1.ForbiddenException('Please provide a valid email');
            }
            const otp = Math.floor(Math.random() * 90000) + 10000;
            return (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)).pipe((0, rxjs_1.map)((hashedOtp) => ({
                otp: hashedOtp,
                otpRaw: otp,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ otp, otpRaw, user }) => {
            return this.db
                .rawQuery(add_otp_for_user_db_query_1.addOtpForUserDbQuery, [
                user.userId,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.resend_signup,
                otp.hashedPassword,
            ], null)
                .pipe((0, rxjs_1.map)(() => ({
                otp: otpRaw,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ otp, user }) => {
            return this.sendSignupWelcomeEmailWithOTP(user.email, user.userId, otp).pipe((0, rxjs_1.map)(() => {
                return {
                    message: 'OTP resent. Please check your email',
                };
            }));
        }));
    }
    verifyAccountOTP(username, otp) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.NotFoundException('OTP or Email is invalid');
            }
            const { otpId, userId, otpHash } = res[0];
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), otpHash)).pipe((0, rxjs_1.map)(() => ({ otpId, userId })));
        }), (0, rxjs_1.switchMap)(({ otpId, userId }) => {
            return this.db.rawQuery(verify_user_otp_and_account_db_query_1.verifyUserOtpAndAccountDbQuery, [otpId, userId], null);
        }), (0, rxjs_1.map)(() => {
            return {
                message: 'Account verified. Please login to continue',
            };
        }));
    }
    forgotPassword(username) {
        const otp = Math.floor(Math.random() * 90000) + 10000;
        return (0, rxjs_1.forkJoin)({
            hashedOtp: (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(String(otp), this.config.saltRounds)),
            user: this.getUserByEmail(username),
        }).pipe((0, rxjs_1.switchMap)(({ hashedOtp, user }) => {
            if (!user) {
                throw new common_1.NotFoundException('Provided email is invalid');
            }
            return this.db
                .rawQuery(add_otp_for_user_db_query_1.addOtpForUserDbQuery, [
                user.userId,
                constants_1.SOURCE_TYPES.email,
                constants_2.OTP_TYPES.reset_password,
                hashedOtp.hashedPassword,
            ], null)
                .pipe((0, rxjs_1.map)(() => ({
                otp,
                user,
            })));
        }), (0, rxjs_1.switchMap)(({ user }) => {
            const email = {
                from: constants_1.INVESTMATES_EMAIL,
                to: user.email,
                subject: 'Forgot Password - InvestMates',
                html: `<h1>Temp password - ${otp}</h1>`,
                text: `Temp password - ${otp}`,
            };
            return (0, rxjs_1.from)(this.sendGrid.sendEmail({
                email,
                userId: user.userId,
                emailType: constants_1.EMAIL_TYPES.forgot_password,
            }));
        }), (0, rxjs_1.map)(() => {
            return {
                message: 'Email with OTP sent. Please check your email',
            };
        }));
    }
    validateResetPasswordOTP(username, otp) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), res[0].otpHash));
        }), (0, rxjs_1.map)((isOtpValid) => {
            if (!isOtpValid) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return {
                message: 'OTP is valid',
            };
        }));
    }
    resetPassword({ username, otp, password }) {
        return this.db
            .rawQuery(get_otp_by_email_db_query_1.getOtpByEmailDbQuery, [username], get_otp_by_email_db_dto_1.GetOtpByEmailDbDto)
            .pipe((0, rxjs_1.switchMap)((res) => {
            if (!res.length) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            const { otpHash, otpId, userId } = res[0];
            return (0, rxjs_1.from)(utils_service_1.UtilsService.comparePassword(String(otp), otpHash)).pipe((0, rxjs_1.map)((isOtpValid) => ({ isOtpValid, userId, otpId })));
        }), (0, rxjs_1.switchMap)(({ isOtpValid, userId, otpId }) => {
            if (!isOtpValid) {
                throw new common_1.ForbiddenException('Username or OTP is invalid');
            }
            return (0, rxjs_1.from)(utils_service_1.UtilsService.generatePasswordHash(password, this.config.saltRounds)).pipe((0, rxjs_1.map)((password) => ({ password, userId, otpId })));
        }), (0, rxjs_1.switchMap)(({ password, userId, otpId }) => {
            return this.db.rawQuery(reset_password_db_query_1.resetPasswordDbQuery, [password.hashedPassword, password.passwordSalt, userId, otpId], null);
        }), (0, rxjs_1.map)(() => ({
            message: 'Password reset success. Please login again.',
        })));
    }
    getPreSignedUrlForProfilePicture(fileName, userId) {
        const fileSplit = fileName.split('.');
        return this.S3.getS3PreSignUrl({
            bucket: constants_1.S3_BUCKET,
            filename: `${Date.now()}_${fileSplit[0]}_o.${fileSplit[1]}`,
            path: `${constants_1.S3_FOLDER_PROFILE_IMAGE}/${userId}`,
        }).pipe((0, rxjs_1.map)(({ filePath, uploadUrl }) => ({ filePath, uploadUrl })));
    }
    updateProfileImageUrls(filePath, userId) {
        const { large, medium, original, small, thumbnail } = utils_service_1.UtilsService.generateImagUrlForAllSizes(filePath);
        return this.db
            .rawQuery(update_profile_image_db_query_1.updateProfileImageDbQuery, [userId, original, thumbnail, small, medium, large], null)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    getUserProfileDetails(loggedInUser, userId) {
        return this.db
            .rawQuery(get_profile_details_db_query_1.getProfileDetailsDbQuery, [userId, loggedInUser], get_profile_details_response_dto_1.GetProfileDetailsResponseDto)
            .pipe((0, rxjs_1.map)((details) => { var _a; return (_a = details[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    updateIsSignupComplete(userId) {
        return this.db
            .rawQuery(update_user_signup_complete_bool_db_query_1.UpdateUserIsSignupCompleteFlagDbQuery, [userId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    updateIsDemoComplete(userId) {
        return this.db
            .rawQuery(update_user_demo_complete_bool_db_query_1.UpdateUserIsDemoCompleteFlagDbQuery, [userId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    sendSignupWelcomeEmailWithOTP(email, userId, otp) {
        return this.sendGrid.sendEmail({
            email: {
                to: email,
                from: constants_1.INVESTMATES_EMAIL,
                subject: 'Welcome to Investmates',
                text: welcome_verify_otp_1.welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
                html: welcome_verify_otp_1.welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
            },
            userId,
            emailType: constants_1.EMAIL_TYPES.welcome_email,
        });
    }
    searchUsers(query) {
        return this.db.rawQuery(search_users_db_query_1.searchUserDbQuery, [`${query}%`], search_users_response_dto_1.SearchUsersResponseDto);
    }
    updateProfile(userId, profile) {
        var _a, _b, _c;
        const valuesArray = [userId];
        const queriesArray = [];
        const arrayToSkip = ['timeline', 'investmentStyle', 'interest'];
        const columnToSkip = [
            'createdAt',
            'lastUpdated',
            'password',
            'passwordSalt',
            'profileImage',
            'id',
            'userId',
            'isDeleted',
            'email',
            'isVerified',
            'isSignupComplete',
            'isActive',
            'userHandle',
            'experienceLevel',
        ];
        const addSQLQuery = {
            last_updated: 'current_timestamp',
        };
        const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
            tableName: 'user_profile',
            columnData: profile,
            keysToIgnore: [...arrayToSkip, ...columnToSkip],
            keysToReplace: { isDeleted: false },
            addSqlQuery: addSQLQuery,
            whereCondition: 'user_id = $1',
            start: 2,
        });
        queriesArray.push(`upd_user_profile as (${query} RETURNING *)`);
        valuesArray.push(...data);
        if (profile.userHandle) {
            const { query, data } = utils_service_1.UtilsService.buildUpdateQuery({
                tableName: 'user_core',
                columnData: {
                    userHandle: profile.userHandle,
                },
                keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
                whereCondition: 'id = $1',
                start: valuesArray.length + 1,
            });
            queriesArray.push(`upd_user_core as (${query})`);
            valuesArray.push(...data);
        }
        if (profile.experienceLevel) {
            queriesArray.push(`del_user_experience as (DELETE from user_experience where user_id = $1)`);
            const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                tableName: 'user_experience',
                columnData: [
                    {
                        experienceId: profile.experienceLevel,
                    },
                ],
                keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
                addSqlQuery: {
                    user_id: '$1',
                },
                start: valuesArray.length + 1,
            });
            queriesArray.push(`ins_user_experience as (${query})`);
            valuesArray.push(...data);
        }
        if (Array.isArray(profile.timeline)) {
            queriesArray.push(`del_timeline as (DELETE from investment_timeline where user_id = $1)`);
            if ((_a = profile.timeline) === null || _a === void 0 ? void 0 : _a.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'investment_timeline',
                    columnData: profile.timeline,
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'userId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_timeline as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(profile.investmentStyle)) {
            queriesArray.push(`del_investment_style as (DELETE from user_investment_types where user_id = $1)`);
            if ((_b = profile.investmentStyle) === null || _b === void 0 ? void 0 : _b.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'user_investment_types',
                    columnData: profile.investmentStyle.map((x) => ({ investmentId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_user_investment_types as (${query})`);
                valuesArray.push(...data);
            }
        }
        if (Array.isArray(profile.interest)) {
            queriesArray.push(`del_user_interest as (DELETE from user_interests where user_id = $1)`);
            if ((_c = profile.interest) === null || _c === void 0 ? void 0 : _c.length) {
                const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
                    tableName: 'user_interests',
                    columnData: profile.interest.map((x) => ({ interestsId: x })),
                    keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
                    addSqlQuery: {
                        user_id: '$1',
                    },
                    start: valuesArray.length + 1,
                });
                queriesArray.push(`ins_user_interest as (${query})`);
                valuesArray.push(...data);
            }
        }
        return this.db
            .rawQuery(`WITH ${queriesArray.join(', ')} (select user_id from upd_user_profile) `, valuesArray, null)
            .pipe((0, rxjs_1.map)((res) => res[0]));
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        sendgrid_service_1.SendgridService,
        s3_service_1.S3Service,
        logging_service_1.Logger,
        auth_service_1.AuthService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map