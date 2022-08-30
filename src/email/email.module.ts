import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailResolver } from './email.resolver';

@Module({
  providers: [EmailService, UserService, PrismaService, EmailResolver],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
