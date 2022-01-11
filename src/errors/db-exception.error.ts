import { ERROR_CODES } from 'src/shared/constants';

import { HttpException, HttpStatus } from '@nestjs/common';

import { UtilsService } from '../utils/utils.service';

export class DbExceptionError extends HttpException {
  constructor(props, context) {
    if (context.includes('duplicate key value violates unique constraint')) {
      props = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            props.detail.split(/[()]/, 2)[1],
          )} should be unique`,
        ],
      };
      context = 400;
    } else if (context.includes('violates foreign key constraint')) {
      props = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            props.detail.split(/[()]/, 2)[1],
          )} is invalid`,
        ],
      };
      context = 400;
    } else if (context.includes('violates check constraint')) {
      props = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            context.split(/"(.*?)"/g, 2)[1],
          )} should be a allowed value`,
        ],
      };
      context = 400;
    } else {
      props = {
        statusCode: ERROR_CODES.DEFAULT.statusCode,
        message: ERROR_CODES.DEFAULT.message,
      };
      context = ERROR_CODES.DEFAULT.statusCode;
    }
    super(props, context);
  }
}
