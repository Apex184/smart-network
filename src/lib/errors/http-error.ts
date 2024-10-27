export abstract class HttpError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, HttpError.prototype);
  }

  abstract serializeError(): {
    success: boolean;
    message: string;
    error?: { message: string; field?: string } | { message: string; field?: string }[];
  };
}
