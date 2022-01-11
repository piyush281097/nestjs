import { ERROR_CODES } from 'src/shared/constants';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Logger } from '../shared/logger/logging.service';

interface ResError {
  statusCode?: number;
  message?: string;
}

interface LogError extends ResError {
  timestamp?: string;
  path?: string;
  host?: string;
  response?: ResError;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let resError: ResError;
    let msg: string;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.FORBIDDEN;

    if (exception.response?.statusCode) {
      msg = exception.response.message;
      resError = exception.response;
    } else if (exception.response?.code) {
      msg = exception.response.message;
      resError = exception.response;
    } else if (exception.response?.data?.statusCode) {
      msg = exception.response.data.message;
      resError = exception.response.data;
    } else {
      msg =
        typeof exception.message === 'string'
          ? exception.message
          : exception.message.message;
      resError = ERROR_CODES.DEFAULT;
    }

    const logError: LogError = {
      statusCode: status,
      timestamp: new Date().toString(),
      path: request.url,
      message: msg || 'Something went wrong',
      host: request.headers.host,
      response: resError,
    };

    this.logger.log(
      `${request.method} ${request.url} ${status}
      ${JSON.stringify(logError)}`,
    );
    return response.status(status).send(resError);
  }
}
