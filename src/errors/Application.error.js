export class ApplicationError extends Error {
  constructor(status, message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = status || 500;
    this.message = message || 'Something went wrong. Please try again.';
  }
}
