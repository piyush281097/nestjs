"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const bcrypt = require("bcrypt");
const constants_1 = require("../shared/constants");
const common_1 = require("@nestjs/common");
let UtilsService = class UtilsService {
    static convertStringToSentenceCase(stringToBeConverted) {
        return stringToBeConverted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    static convertSnakeCaseToCamelCase(stringToBeConverted) {
        return stringToBeConverted.replace(/(_\w)/g, (k) => {
            return k[1].toUpperCase();
        });
    }
    static camelToSnakeCase(str) {
        return str.replace(/[A-Z0-9]/g, (letter) => `_${letter.toLowerCase()}`);
    }
    static isObjectEmpty(objectToCheck) {
        for (const i in objectToCheck)
            return false;
        return true;
    }
    static async generatePasswordHash(password, saltRounds) {
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, passwordSalt);
        return {
            passwordSalt,
            hashedPassword,
        };
    }
    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    static generatePassword(length = 10) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }
    static generateImagUrlForAllSizes(originalImageUrl) {
        const regexForFileTypeExtension = /(_o.)(?!.*\1)/gm;
        const urlSplit = originalImageUrl.split(regexForFileTypeExtension);
        const mediaTypes = {
            thumbnail: '',
            small: '',
            medium: '',
            large: '',
            original: originalImageUrl,
        };
        for (const key in constants_1.IMAGE_EXTENSION) {
            mediaTypes[key] = `${urlSplit[0]}${constants_1.IMAGE_EXTENSION[key]}${urlSplit[2]}`;
        }
        return mediaTypes;
    }
    static buildInsertQuery({ tableName, columnData, keysToIgnore, keysToReplace = {}, addSqlQuery = {}, start = 1, }) {
        columnData = columnData.map((singleData) => {
            for (const singleKeyToReplace in keysToReplace) {
                singleData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
            }
            return singleData;
        });
        const columnKeyNames = Object.keys(columnData[0]);
        const columnNamesSnakeCase = columnKeyNames
            .filter((x) => !keysToIgnore.includes(x))
            .map(this.camelToSnakeCase)
            .map((x) => `"${x}"`);
        const param = [], value = [];
        for (const key in addSqlQuery) {
            columnNamesSnakeCase.push(key);
        }
        for (const singleRow of columnData) {
            const { preparedParam, preparedValue } = this.getPreparedParams(singleRow, keysToIgnore, start, columnKeyNames);
            for (const key in addSqlQuery) {
                preparedParam.push(addSqlQuery[key]);
            }
            param.push(preparedParam);
            value.push(...preparedValue);
            start += preparedValue.length;
        }
        const columnNames = columnNamesSnakeCase.join(', ');
        return {
            query: `INSERT INTO ${tableName} (${columnNames})
              VALUES ${param.map((x) => `(${x.join(', ')})`)}`,
            data: value,
        };
    }
    static buildUpdateQuery({ tableName, columnData, keysToIgnore, keysToReplace = {}, addSqlQuery = {}, whereCondition, start = 1, }) {
        for (const singleKeyToReplace in keysToReplace) {
            columnData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
        }
        const { preparedParam, preparedValue } = this.alterPreparedParams(columnData, keysToIgnore, start);
        for (const key in addSqlQuery) {
            preparedParam.push(`${key} = ${addSqlQuery[key]}`);
        }
        return {
            query: `UPDATE ${tableName}
              SET ${preparedParam.join(', ')}
              WHERE ${whereCondition}`,
            data: preparedValue,
        };
    }
    static getPreparedParams(columnData, keysToIgnore, start = 1, columnKeyNames) {
        var _a;
        const preparedValue = [];
        const preparedParam = [];
        for (const key of columnKeyNames) {
            if (!keysToIgnore.includes(key)) {
                columnData[key] = columnData[key] === '' ? null : columnData[key];
                preparedParam.push(`$${start}`);
                preparedValue.push((_a = columnData[key]) !== null && _a !== void 0 ? _a : null);
                start++;
            }
        }
        return {
            preparedParam,
            preparedValue,
        };
    }
    static alterPreparedParams(columnData, keysToIgnore, start = 1) {
        const preparedValue = [];
        const preparedParam = [];
        for (const key in columnData) {
            if (!keysToIgnore.includes(key)) {
                columnData[key] = columnData[key] === '' ? null : columnData[key];
                preparedParam.push(`${this.camelToSnakeCase(key)} = $${start}`);
                preparedValue.push(columnData[key]);
                start++;
            }
        }
        return {
            preparedParam,
            preparedValue,
        };
    }
};
UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils.service.js.map