"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const common_module_1 = require("./common/common.module");
const posts_module_1 = require("./posts/posts.module");
const assets_module_1 = require("./assets/assets.module");
const trades_module_1 = require("./trades/trades.module");
const followers_module_1 = require("./followers/followers.module");
const portfolio_module_1 = require("./portfolio/portfolio.module");
const bookmark_module_1 = require("./bookmark/bookmark.module");
const social_login_module_1 = require("./social-login/social-login.module");
const notifications_module_1 = require("./notifications/notifications.module");
const room_module_1 = require("./room/room.module");
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, common_module_1.CommonModule, posts_module_1.PostsModule, assets_module_1.AssetsModule, trades_module_1.TradesModule, followers_module_1.FollowersModule, portfolio_module_1.PortfolioModule, bookmark_module_1.BookmarkModule, social_login_module_1.SocialLoginModule, notifications_module_1.NotificationsModule, room_module_1.RoomModule],
    })
], ApiModule);
exports.ApiModule = ApiModule;
//# sourceMappingURL=api.module.js.map