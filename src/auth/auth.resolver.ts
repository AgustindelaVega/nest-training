import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { Jwt } from './dto/jwt';
import { LoginInput } from '../user/dto/login.input';

@Resolver(() => Jwt)
@UseGuards(LocalAuthGuard)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Jwt)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(null);
  }
}
