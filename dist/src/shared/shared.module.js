"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const utils_service_1 = require("../utils/utils.service");
const city_falcon_module_1 = require("./city-falcon/city-falcon.module");
const iex_module_1 = require("./iex/iex.module");
const logging_module_1 = require("./logger/logging.module");
const s3_module_1 = require("./s3/s3.module");
const sendgrid_module_1 = require("./sendgrid/sendgrid.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            logging_module_1.LoggerModule,
            sendgrid_module_1.SendgridModule,
            s3_module_1.S3Module,
            iex_module_1.IexModule,
            city_falcon_module_1.CityFalconModule,
        ],
        providers: [utils_service_1.UtilsService],
        exports: [
            database_module_1.DatabaseModule,
            logging_module_1.LoggerModule,
            utils_service_1.UtilsService,
            sendgrid_module_1.SendgridModule,
            s3_module_1.S3Module,
            iex_module_1.IexModule,
            city_falcon_module_1.CityFalconModule,
        ],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map