import { Field, ObjectType } from '@nestjs/graphql';
import { EmailUsage } from '../../email/dto/email.usage';

@ObjectType()
export class UserModel {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true, defaultValue: 'USER' })
  role?: string;

  @Field(() => EmailUsage)
  emailUsage: EmailUsage;
}
