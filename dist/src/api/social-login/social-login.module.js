"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLoginModule = void 0;
const shared_module_1 = require("../../shared/shared.module");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const google_strategy_1 = require("../auth/strategies/google.strategy");
const social_login_controller_1 = require("./social-login.controller");
const social_login_service_1 = require("./social-login.service");
let SocialLoginModule = class SocialLoginModule {
};
SocialLoginModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule, auth_module_1.AuthModule],
        controllers: [social_login_controller_1.SocialLoginController],
        providers: [social_login_service_1.SocialLoginService, google_strategy_1.GoogleStrategy],
    })
], SocialLoginModule);
exports.SocialLoginModule = SocialLoginModule;
//# sourceMappingURL=social-login.module.js.map