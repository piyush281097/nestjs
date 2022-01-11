import * as bcrypt from 'bcrypt';
import { IMAGE_EXTENSION } from 'src/shared/constants';

import { Injectable } from '@nestjs/common';

interface IHashPassword {
  passwordSalt: string;
  hashedPassword: string;
}

interface ImageSizes {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

interface QueryForMultipleRow {
  tableName: string;
  columnData: Array<{ [s: string]: any }>;
  keysToIgnore: string[];
  keysToReplace?: Record<string, any>;
  whereCondition?: string;
  addSqlQuery?: Record<string, any>;
  start?: number;
}

interface UpdateQueryForMultipleRow {
  tableName: string;
  columnData: { [s: string]: any };
  keysToIgnore: string[];
  keysToReplace?: Record<string, any>;
  whereCondition?: string;
  addSqlQuery?: Record<string, any>;
  start?: number;
}
@Injectable()
export class UtilsService {
  static convertStringToSentenceCase(stringToBeConverted: string) {
    return stringToBeConverted.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  static convertSnakeCaseToCamelCase(stringToBeConverted: string) {
    return stringToBeConverted.replace(/(_\w)/g, (k) => {
      return k[1].toUpperCase();
    });
  }

  static camelToSnakeCase(str) {
    return str.replace(/[A-Z0-9]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static isObjectEmpty(objectToCheck) {
    for (const i in objectToCheck) return false;
    return true;
  }

  static async generatePasswordHash(
    password: string,
    saltRounds: number,
  ): Promise<IHashPassword> {
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, passwordSalt);

    return {
      passwordSalt,
      hashedPassword,
    };
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generatePassword(length = 10): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
  }

  static generateImagUrlForAllSizes(originalImageUrl: string) {
    // Modify the images URLs.
    const regexForFileTypeExtension = /(_o.)(?!.*\1)/gm;
    const urlSplit = originalImageUrl.split(regexForFileTypeExtension);
    const mediaTypes: ImageSizes = {
      thumbnail: '',
      small: '',
      medium: '',
      large: '',
      original: originalImageUrl,
    };

    for (const key in IMAGE_EXTENSION) {
      mediaTypes[key] = `${urlSplit[0]}${IMAGE_EXTENSION[key]}${urlSplit[2]}`;
    }
    return mediaTypes;
  }

  static buildInsertQuery({
    tableName,
    columnData,
    keysToIgnore,
    keysToReplace = {},
    addSqlQuery = {},
    start = 1,
  }: QueryForMultipleRow) {
    // Replace the dynamic values here
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
    const param = [],
      value = [];

    for (const key in addSqlQuery) {
      columnNamesSnakeCase.push(key);
    }

    for (const singleRow of columnData) {
      const { preparedParam, preparedValue } = this.getPreparedParams(
        singleRow,
        keysToIgnore,
        start,
        columnKeyNames,
      );
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

  static buildUpdateQuery({
    tableName,
    columnData,
    keysToIgnore,
    keysToReplace = {},
    addSqlQuery = {},
    whereCondition,
    start = 1,
  }: UpdateQueryForMultipleRow) {
    // Replace the dynamic values here
    for (const singleKeyToReplace in keysToReplace) {
      columnData[singleKeyToReplace] = keysToReplace[singleKeyToReplace];
    }

    const { preparedParam, preparedValue } = this.alterPreparedParams(
      columnData,
      keysToIgnore,
      start,
    );

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

  private static getPreparedParams(
    columnData,
    keysToIgnore,
    start = 1,
    columnKeyNames: string[],
  ) {
    const preparedValue = [];
    const preparedParam = [];

    for (const key of columnKeyNames) {
      if (!keysToIgnore.includes(key)) {
        columnData[key] = columnData[key] === '' ? null : columnData[key];
        preparedParam.push(`$${start}`);
        preparedValue.push(columnData[key] ?? null);
        start++;
      }
    }

    return {
      preparedParam,
      preparedValue,
    };
  }

  private static alterPreparedParams(columnData, keysToIgnore, start = 1) {
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
}
