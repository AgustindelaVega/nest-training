import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Jwt {
  @Field()
  access_token: string;
}
