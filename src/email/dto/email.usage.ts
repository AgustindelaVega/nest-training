import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailUsage {
  @Field()
  dailyUsage: string;

  @Field(() => String)
  lastEmailDate: Date;
}
