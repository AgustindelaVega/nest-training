import { AbstractEmailHandler } from './email.handler';
import { Email } from '../entities/email';
import * as sgMail from '@sendgrid/mail';

export class SendgridHandler extends AbstractEmailHandler {
  public handleEmail(email: Email): void {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail
      .send({
        from: process.env.SENDGRID_VERIFIED_SENDER,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
      })
      .then(
        (res) => {
          console.log('Sending email with SendGrid');
        },
        (err) => {
          // if error, try and send email with next handler
          if (this.nextHandler) this.nextHandler.handleEmail(email);
        },
      );
  }
}
