"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const validation_1 = require("./config/validation");
const database_module_1 = require("./database/database.module");
const logging_module_1 = require("./shared/logger/logging.module");
const shared_module_1 = require("./shared/shared.module");
const core_1 = require("@nestjs/core");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const api_module_1 = require("./api/api.module");
const chat_gateway_1 = require("./chat.gateway");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: validation_1.default,
            }),
            database_module_1.DatabaseModule,
            api_module_1.ApiModule,
            logging_module_1.LoggerModule,
            shared_module_1.SharedModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            chat_gateway_1.ChatGateway,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map