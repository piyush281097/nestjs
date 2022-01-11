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
var SocialLoginService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLoginService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const constants_1 = require("../../shared/constants");
const logging_service_1 = require("../../shared/logger/logging.service");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const add_user_db_query_1 = require("../user/db-query/add-user.db-query");
const get_user_by_email_db_query_1 = require("../user/db-query/get-user-by-email.db-query");
const get_user_by_email_db_dto_1 = require("../user/dto/database/get-user-by-email.db-dto");
const user_create_return_db_dto_1 = require("../user/dto/database/user-create-return.db-dto");
let SocialLoginService = SocialLoginService_1 = class SocialLoginService {
    constructor(config, db, logger, authService) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.authService = authService;
        this.logger.setContext(SocialLoginService_1.name);
    }
    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        const { accessToken, email, firstName, lastName, picture } = req.user;
        return this.db
            .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }), (0, rxjs_1.switchMap)((res) => {
            if (!res) {
                const userHandleTail = Math.floor(Math.random() * 90000) + 10000;
                const userHandle = `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();
                return this.db
                    .rawQuery(add_user_db_query_1.addUserSocialLoginDbQuery, [email, firstName, lastName, userHandle], user_create_return_db_dto_1.UserCreateReturnDto)
                    .pipe((0, rxjs_1.switchMap)(() => {
                    return this.db
                        .rawQuery(get_user_by_email_db_query_1.getUserByEmailDbQuery, [email], get_user_by_email_db_dto_1.GetUserByEmailDbDto)
                        .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res[0]) !== null && _a !== void 0 ? _a : null; }));
                }));
            }
            else {
                if (!res.isSocialLogin) {
                    throw new common_1.ForbiddenException('Email already exists! Try login via email method');
                }
                return (0, rxjs_1.of)(res);
            }
        }), (0, rxjs_1.map)((user) => {
            return this.authService.login(user);
        }));
    }
};
SocialLoginService = SocialLoginService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger,
        auth_service_1.AuthService])
], SocialLoginService);
exports.SocialLoginService = SocialLoginService;
//# sourceMappingURL=social-login.service.js.map