import { ErrorMessage } from '../constants';
import { HttpError } from './http-error';

export class RequestValidationError extends HttpError {
  statusCode = 422;

  constructor(public error: { message: string; path?: (string | number)[] }[]) {
    super(ErrorMessage.InvalidRequestParameters);

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
      error: this.error.map((err) => ({
        message: err.message,
        field: typeof err.path?.[0] === 'string' ? err.path?.join('.') : undefined,
      })),
    };
  }
}
