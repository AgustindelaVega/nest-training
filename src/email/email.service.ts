import { Injectable } from '@nestjs/common';
import { Email } from './entities/email';
import { AbstractEmailHandler } from './providers/email.handler';
import { SendgridHandler } from './providers/sendgrid.handler';
import { MailgunHandler } from './providers/mailgun.handler';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(private readonly userService: UserService) {
    const mailgunHandler = new MailgunHandler(null);
    this.initialHandler = new SendgridHandler(mailgunHandler);
  }

  private initialHandler: AbstractEmailHandler;

  async sendEmail(user: User, email: Email): Promise<void> {
    await this.userService.addEmailUsage(user);
    this.initialHandler.handleEmail(email);
  }

  async getAdminStats() {
    return this.userService.usersWithDailyEmailUsage();
  }
}
