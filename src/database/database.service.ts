import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Pool } from 'pg';
import { from, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { POSTGRES_CONNECTION } from './database.constants';
import { DatabaseInterface } from './interfaces/database.interface';
import { DbExceptionError } from '../errors/db-exception.error';

@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject(POSTGRES_CONNECTION) private pool: Pool) {}

  private static isArray(a: Array<any>): boolean {
    return !!a && a.constructor === Array;
  }

  private static isObject(a: Record<string, any>): boolean {
    return !!a && a.constructor === Object;
  }

  private runQuery(
    query: string,
    params: any[],
    type: Type<T>,
    camelCase = true,
  ): Observable<T[]> {
    const start = Date.now();
    return from(this.pool.query(query, params)).pipe(
      tap((qRes) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
          rows: qRes.rowCount,
        });
      }),
      map((qRes) =>
        qRes.rows
          .map((row) => (camelCase ? this.underScoreToCamelCase(row) : row))
          .map((row) => plainToClass(type, row)),
      ),
      catchError((err) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
        });
        this.logger.error(err);
        throw new DbExceptionError(err, err.message);
      }),
    );
  }

  private underScoreToCamelCase(
    record: Record<string, any>,
  ): Record<string, any> {
    const newObj = {};
    Object.keys(record).forEach((key) => {
      const origKey = key;
      while (key.indexOf('_') > -1) {
        const _index = key.indexOf('_');
        const nextChar = key.charAt(_index + 1);
        key = key.replace(`_${nextChar}`, nextChar.toUpperCase());
      }
      if (
        DatabaseService.isArray(record[origKey]) &&
        !record[origKey].every((i) => typeof i === 'string')
      ) {
        record[origKey] = record[origKey].map((obj: Record<string, any>) => {
          return this.underScoreToCamelCase(obj);
        });
      }

      if (DatabaseService.isObject(record[origKey])) {
        record[origKey] = this.underScoreToCamelCase(record[origKey]);
      }

      newObj[key] = record[origKey];
    });
    return newObj;
  }

  rawQuery(
    query: string,
    params: Array<any>,
    type: Type<T>,
    camelCase?: boolean,
  ){
    return this.runQuery(query, params, type, camelCase);
  }
}
