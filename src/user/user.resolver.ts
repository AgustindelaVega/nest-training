import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './entities/user.model';
import { CreateUserInput } from './dto/createUser.input';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserModel)
  async user(@Args('id', { type: () => String }) id: string) {
    const user = await this.userService.user({ id: id });
    const { password, ...result } = user;
    return result;
  }

  @Mutation(() => UserModel)
  async createUser(@Args('input') userCreationDto: CreateUserInput) {
    return this.userService.createUser(userCreationDto);
  }
}
