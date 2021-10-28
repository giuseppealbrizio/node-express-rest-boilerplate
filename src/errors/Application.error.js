export class ApplicationError extends Error {
  constructor(statusCode, message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.message = message || 'Something went wrong. Please try again.';
    // this.errors = errors;
  }
}
