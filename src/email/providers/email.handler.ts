import { Email } from '../email';

interface EmailHandler {
  setNext(handler: EmailHandler): EmailHandler;
  handleEmail(email: Email): void;
}

export abstract class AbstractEmailHandler implements EmailHandler {
  nextHandler: EmailHandler;

  constructor(handler: EmailHandler) {
    this.nextHandler = handler;
  }

  public setNext(handler: EmailHandler): EmailHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handleEmail(email: Email): void {
    // default implementation just passes email to next handler
    if (this.nextHandler) {
      this.nextHandler.handleEmail(email);
    }
  }
}
