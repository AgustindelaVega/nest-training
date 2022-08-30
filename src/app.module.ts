import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  providers: [PrismaService],
  imports: [
    AuthModule,
    UserModule,
    EmailModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [UserModule, EmailModule],
      autoSchemaFile: process.cwd() + '/src/schema.gql',
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
