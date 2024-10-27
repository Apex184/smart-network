import { HttpError } from './http-error';

export class ConflictError extends HttpError {
  statusCode = 409;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default ConflictError;
