"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IexModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const logging_module_1 = require("../logger/logging.module");
const iex_service_1 = require("./iex.service");
let IexModule = class IexModule {
};
IexModule = __decorate([
    (0, common_1.Module)({
        imports: [logging_module_1.LoggerModule, axios_1.HttpModule],
        exports: [iex_service_1.IexService],
        providers: [iex_service_1.IexService],
    })
], IexModule);
exports.IexModule = IexModule;
//# sourceMappingURL=iex.module.js.map