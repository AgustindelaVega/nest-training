import { AbstractEmailHandler } from './email.handler';
import { Email } from '../entities/email';
import { NodeMailgun } from 'ts-mailgun';

export class MailgunHandler extends AbstractEmailHandler {
  public handleEmail(email: Email): void {
    const mailer = new NodeMailgun(
      process.env.MAILGUN_API_KEY,
      process.env.MAILGUN_DOMAIN,
    );
    mailer.fromEmail = 'backend.challenge@sirius.com.ar';
    mailer.fromTitle = 'Sirius Backend Challenge';

    mailer.init();

    mailer
      .send(
        process.env.MAILGUN_AUTHORIZED_RECIPIENTS,
        email.subject,
        email.text,
      )
      .then((res) => {
        console.log('Sending email with MailGun');
      })
      .catch((err) => {
        if (this.nextHandler) this.nextHandler.handleEmail(email);
      });
  }
}
