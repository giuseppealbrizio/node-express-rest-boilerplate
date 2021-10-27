import { ApplicationError } from './Application.error';

export class NotFoundError extends ApplicationError {
  constructor(message) {
    super(404, message || 'Resource not found Baby');
  }
}
