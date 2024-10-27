import { ErrorMessage } from '../constants';
import { HttpError } from './http-error';

export class ServerError extends HttpError {
  statusCode = 500;

  constructor(message?: string) {
    super(message ?? ErrorMessage.ServerError);

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default ServerError;
