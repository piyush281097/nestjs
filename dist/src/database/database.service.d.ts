import { Type } from '@nestjs/common';
import { Pool } from 'pg';
import { Observable } from 'rxjs';
import { DatabaseInterface } from './interfaces/database.interface';
export declare class DatabaseService<T> implements DatabaseInterface<T> {
    private pool;
    private readonly logger;
    constructor(pool: Pool);
    private static isArray;
    private static isObject;
    private runQuery;
    private underScoreToCamelCase;
    rawQuery(query: string, params: Array<any>, type: Type<T>, camelCase?: boolean): Observable<T[]>;
}
