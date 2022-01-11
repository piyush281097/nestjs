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
var IexService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IexService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const logging_service_1 = require("../logger/logging.service");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
let IexService = IexService_1 = class IexService {
    constructor(config, httpService, logger) {
        this.config = config;
        this.httpService = httpService;
        this.logger = logger;
        this.logger.setContext(IexService_1.name);
    }
    searchAssets(searchQuery) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/search/${searchQuery}?token=${this.config.iex.secretKey}`;
        return this.httpService.get(searchAssetsUrl).pipe((0, rxjs_1.map)((res) => res.data));
    }
    getCompanyInfo(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/company?token=${this.config.iex.secretKey}`;
        return this.httpService.get(searchAssetsUrl).pipe((0, rxjs_1.map)((res) => res.data), (0, rxjs_1.mergeMap)((asset) => this.getAssetLogo(symbol).pipe((0, rxjs_1.map)((logo) => ({ ...asset, logo: logo.url })))));
    }
    getAssetLogo(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/logo?token=${this.config.iex.secretKey}`;
        return this.httpService
            .get(searchAssetsUrl)
            .pipe((0, rxjs_1.map)((res) => res.data));
    }
    getAssetFundamentals(symbol) {
        const searchAssetsUrl = `${this.config.iex.baseUrl}/stock/${symbol}/quote?&token=${this.config.iex.secretKey}`;
        return this.httpService
            .get(searchAssetsUrl)
            .pipe((0, rxjs_1.map)((res) => res.data));
    }
};
IexService = IexService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, axios_1.HttpService,
        logging_service_1.Logger])
], IexService);
exports.IexService = IexService;
//# sourceMappingURL=iex.service.js.map