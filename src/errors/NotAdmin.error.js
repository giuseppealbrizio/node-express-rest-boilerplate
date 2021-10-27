import { ApplicationError } from './Application.error';

export class NotAdminError extends ApplicationError {
  constructor() {
    super(401, 'Not Authorized. You are not admin');
  }
}
