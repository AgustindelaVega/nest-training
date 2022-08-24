import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Email } from './email';
import { RolesGuard } from '../auth/role/auth.guard';
import { Roles } from '../auth/role/role.decorator';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendEmail(@Request() req, @Body() email: Email) {
    return this.emailService.sendEmail(req.user, email);
  }

  @Get('stats')
  @Roles('ADMIN')
  async getAdminStats() {
    return this.emailService.getAdminStats();
  }
}
