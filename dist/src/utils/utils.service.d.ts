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
    columnData: Array<{
        [s: string]: any;
    }>;
    keysToIgnore: string[];
    keysToReplace?: Record<string, any>;
    whereCondition?: string;
    addSqlQuery?: Record<string, any>;
    start?: number;
}
interface UpdateQueryForMultipleRow {
    tableName: string;
    columnData: {
        [s: string]: any;
    };
    keysToIgnore: string[];
    keysToReplace?: Record<string, any>;
    whereCondition?: string;
    addSqlQuery?: Record<string, any>;
    start?: number;
}
export declare class UtilsService {
    static convertStringToSentenceCase(stringToBeConverted: string): string;
    static convertSnakeCaseToCamelCase(stringToBeConverted: string): string;
    static camelToSnakeCase(str: any): any;
    static isObjectEmpty(objectToCheck: any): boolean;
    static generatePasswordHash(password: string, saltRounds: number): Promise<IHashPassword>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static generatePassword(length?: number): string;
    static generateImagUrlForAllSizes(originalImageUrl: string): ImageSizes;
    static buildInsertQuery({ tableName, columnData, keysToIgnore, keysToReplace, addSqlQuery, start, }: QueryForMultipleRow): {
        query: string;
        data: any[];
    };
    static buildUpdateQuery({ tableName, columnData, keysToIgnore, keysToReplace, addSqlQuery, whereCondition, start, }: UpdateQueryForMultipleRow): {
        query: string;
        data: any[];
    };
    private static getPreparedParams;
    private static alterPreparedParams;
}
export {};
