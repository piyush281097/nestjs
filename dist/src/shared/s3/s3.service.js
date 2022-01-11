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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const AWS = require("aws-sdk");
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const common_1 = require("@nestjs/common");
let S3Service = class S3Service {
    constructor(config) {
        this.config = config;
        AWS.config.update({
            credentials: {
                accessKeyId: this.config.aws.accessKeyID,
                secretAccessKey: this.config.aws.secretAccessKey,
            },
            region: this.config.aws.region,
        });
        this.S3 = new AWS.S3({ s3ForcePathStyle: true, signatureVersion: 'v4' });
    }
    getS3PreSignUrl({ bucket, filename, path }) {
        const imageOrgUrl = `https://${bucket}.s3.${this.config.aws.region}.amazonaws.com/${path}/${filename}`;
        return (0, rxjs_1.from)(this.S3.getSignedUrlPromise('putObject', {
            Bucket: bucket,
            ACL: 'public-read',
            Key: `${path}/${filename}`,
        })).pipe((0, rxjs_1.map)((uploadUrl) => ({
            uploadUrl: uploadUrl,
            filePath: imageOrgUrl,
        })));
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0])
], S3Service);
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map