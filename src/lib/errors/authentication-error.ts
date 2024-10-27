import { ErrorMessage } from '../constants';
import { HttpError } from './http-error';

export class AuthenticationError extends HttpError {
  statusCode = 401;

  constructor(message?: string) {
    super(message ?? ErrorMessage.Unauthenticated);

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default AuthenticationError;
