"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersModule = void 0;
const common_1 = require("@nestjs/common");
const shared_module_1 = require("../../shared/shared.module");
const followers_controller_1 = require("./followers.controller");
const followers_service_1 = require("./followers.service");
let FollowersModule = class FollowersModule {
};
FollowersModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_module_1.SharedModule],
        controllers: [followers_controller_1.FollowersController],
        providers: [followers_service_1.FollowersService],
    })
], FollowersModule);
exports.FollowersModule = FollowersModule;
//# sourceMappingURL=followers.module.js.map