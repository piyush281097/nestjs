import { HttpException } from '@nestjs/common';
export declare class DbExceptionError extends HttpException {
    constructor(props: any, context: any);
}
