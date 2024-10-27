import { ErrorMessage } from '../constants';
import { HttpError } from './http-error';

export class AuthorizationError extends HttpError {
  statusCode = 403;

  constructor(message?: string) {
    super(message ?? ErrorMessage.Unauthorized);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default AuthorizationError;
