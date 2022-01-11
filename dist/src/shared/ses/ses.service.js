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
var SesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesService = void 0;
const aws_sdk_1 = require("aws-sdk");
const rxjs_1 = require("rxjs");
const add_email_log_db_query_1 = require("../../api/user/db-query/add-email-log.db-query");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../logger/logging.service");
let SesService = SesService_1 = class SesService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(SesService_1.name);
        this.ses = new aws_sdk_1.SES({
            apiVersion: '2010-12-01',
            credentials: {
                accessKeyId: this.config.aws.accessKeyID,
                secretAccessKey: this.config.aws.secretAccessKey,
            },
            region: this.config.aws.region,
        });
    }
    sendEmail({ email, userId, emailType }) {
        return (0, rxjs_1.from)(this.ses
            .sendEmail({
            Destination: {
                CcAddresses: [],
                ToAddresses: [email.to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: email.html,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: email.text,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: email.subject,
                },
            },
            Source: email.from,
            ReplyToAddresses: [email.from],
        })
            .promise()).pipe((0, rxjs_1.catchError)((error) => {
            return (0, rxjs_1.of)(error.message);
        }), (0, rxjs_1.switchMap)((response) => {
            let isSuccess = true, failedReason = '';
            if (typeof response === 'string') {
                isSuccess = false;
                failedReason = response;
            }
            return this.db.rawQuery(add_email_log_db_query_1.addEmailLogDbQuery, [
                userId,
                emailType,
                email.from,
                email.to,
                email.subject,
                email.html,
                isSuccess,
                failedReason,
            ], null);
        }));
    }
};
SesService = SesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], SesService);
exports.SesService = SesService;
//# sourceMappingURL=ses.service.js.map