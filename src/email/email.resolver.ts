import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { EmailService } from './email.service';
import { Email } from './entities/email';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql/gql.auth.guard';
import { CurrentUser } from '../auth/graphql/currentuser.decorator';
import { User } from '@prisma/client';
import { Roles } from '../auth/role/role.decorator';
import { UserListingDto } from '../user/dto/user.listing.dto';
import { RolesGuard } from '../auth/role/auth.guard';

@Resolver(() => Email)
@UseGuards(GqlAuthGuard, RolesGuard)
export class EmailResolver {
  constructor(private emailService: EmailService) {}

  @Mutation(() => String)
  async sendEmail(@Args('email') email: Email, @CurrentUser() user: User) {
    await this.emailService.sendEmail(user, email);
    return 'ok';
  }

  @Query(() => UserListingDto)
  @Roles('ADMIN')
  async getAdminStats() {
    const users = await this.emailService.getAdminStats();
    return {
      users: users,
    };
  }
}
