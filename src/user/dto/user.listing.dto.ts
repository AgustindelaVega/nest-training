import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../entities/user.model';

@ObjectType()
export class UserListingDto {
  @Field(() => [UserModel])
  users: UserModel[];
}
