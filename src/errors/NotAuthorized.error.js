import { ApplicationError } from './Application.error';

export class NotAuthorizedError extends ApplicationError {
  constructor() {
    super(401, 'Not Authorized. Invalid token, please log in or sign up');
  }
}
