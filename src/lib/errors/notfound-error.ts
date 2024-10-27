import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  statusCode = 404;

  constructor(resource: string = 'Resource') {
    super(`${resource} does not exist`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return {
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default NotFoundError;
