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
var AssetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsService = void 0;
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const common_1 = require("@nestjs/common");
const city_falcon_service_1 = require("../../shared/city-falcon/city-falcon.service");
const iex_service_1 = require("../../shared/iex/iex.service");
const search_assets_db_query_1 = require("./db-query/search-assets.db-query");
let AssetsService = AssetsService_1 = class AssetsService {
    constructor(db, iex, cityFalcon, logger) {
        this.db = db;
        this.iex = iex;
        this.cityFalcon = cityFalcon;
        this.logger = logger;
        this.logger.setContext(AssetsService_1.name);
    }
    getAssetDetails(searchQuery) {
        return this.iex.searchAssets(searchQuery);
    }
    getAssetLogo(symbol) {
        return this.iex.getAssetLogo(symbol);
    }
    searchAssetsFromDb(query) {
        return this.db.rawQuery(search_assets_db_query_1.searchAssetDbQuery, [`${query}%`], null);
    }
    getCompanyInfo(symbol) {
        return this.iex.getCompanyInfo(symbol);
    }
    getCompanyFundamentals(symbol) {
        return this.iex.getAssetFundamentals(symbol);
    }
    getCompanyNews(symbol) {
        return this.cityFalcon.getAssetNews(symbol);
    }
};
AssetsService = AssetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        iex_service_1.IexService,
        city_falcon_service_1.CityFalconService,
        logging_service_1.Logger])
], AssetsService);
exports.AssetsService = AssetsService;
//# sourceMappingURL=assets.service.js.map