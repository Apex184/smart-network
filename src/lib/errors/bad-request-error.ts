import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
    statusCode = 400;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return {
            success: false,
            message: this.message,
            data: null,
        };
    }
}

export default BadRequestError;
