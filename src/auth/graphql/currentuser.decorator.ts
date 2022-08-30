import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data, req) => {
  const ctx = GqlExecutionContext.create(req);
  return ctx.getContext().req.user;
});
