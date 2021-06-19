import {
  BodyParams,
  Controller,
  Post,
  ProviderScope,
  Req,
  Scope,
} from '@tsed/common';
import { Name } from '@tsed/schema';

import { user as User } from '@prisma/client';
import { Authenticate } from '@tsed/passport';

@Controller('/auth')
@Name('Authentication')
@Scope(ProviderScope.SINGLETON)
class AuthCtrl {
  @Post('/login')
  @Authenticate('login')
  login(
    @Req() req: Req,
    @BodyParams('email') email: string,
    @BodyParams('password') password: string,
  ): Partial<User> | undefined {
    return req.user;
  }
}

export default AuthCtrl;
