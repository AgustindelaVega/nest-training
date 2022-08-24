import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';

@Module({
  providers: [PrismaService],
  imports: [AuthModule, UserModule, EmailModule],
  controllers: [AppController],
})
export class AppModule {}
