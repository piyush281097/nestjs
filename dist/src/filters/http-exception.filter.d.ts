import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Logger } from '../shared/logger/logging.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: Logger);
    catch(exception: any, host: ArgumentsHost): any;
}
