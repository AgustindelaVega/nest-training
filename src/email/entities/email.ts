import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Email {
  @Field()
  to: string;

  @Field()
  subject: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  html?: string;

  @Field({ nullable: true })
  from?: string;
}
