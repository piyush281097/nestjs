"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendgridModule = void 0;
const database_module_1 = require("../../database/database.module");
const common_1 = require("@nestjs/common");
const logging_module_1 = require("../logger/logging.module");
const sendgrid_service_1 = require("./sendgrid.service");
let SendgridModule = class SendgridModule {
};
SendgridModule = __decorate([
    (0, common_1.Module)({
        imports: [logging_module_1.LoggerModule, database_module_1.DatabaseModule],
        providers: [sendgrid_service_1.SendgridService],
        exports: [sendgrid_service_1.SendgridService],
    })
], SendgridModule);
exports.SendgridModule = SendgridModule;
//# sourceMappingURL=sendgrid.module.js.map