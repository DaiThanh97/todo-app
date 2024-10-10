import { HttpStatus } from '@nestjs/common';
import { BaseError, IBaseError } from '../../common/errors/base.error';

export class TodoError extends BaseError {}

export const TODO_NOT_FOUND: IBaseError = {
  message: 'Todo not found.',
  statusCode: HttpStatus.NOT_FOUND,
};

export const TODO_NOT_OWNED: IBaseError = {
  message: 'Todo not owned by you.',
  statusCode: HttpStatus.UNAUTHORIZED,
};
