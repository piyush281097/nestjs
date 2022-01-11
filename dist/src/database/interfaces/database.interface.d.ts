import { Type } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface DatabaseInterface<T> {
    rawQuery(query: string, params: any[], type: Type<T>, camelCase?: boolean): Observable<T[]>;
}
