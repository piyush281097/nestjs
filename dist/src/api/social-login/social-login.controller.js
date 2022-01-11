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
exports.SocialLoginController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const social_login_service_1 = require("./social-login.service");
let SocialLoginController = class SocialLoginController {
    constructor(socialLoginService) {
        this.socialLoginService = socialLoginService;
    }
    async googleAuth(req) { }
    googleAuthRedirect(req) {
        return this.socialLoginService.googleLogin(req);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialLoginController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocialLoginController.prototype, "googleAuthRedirect", null);
SocialLoginController = __decorate([
    (0, common_1.Controller)('social-login'),
    __metadata("design:paramtypes", [social_login_service_1.SocialLoginService])
], SocialLoginController);
exports.SocialLoginController = SocialLoginController;
//# sourceMappingURL=social-login.controller.js.map