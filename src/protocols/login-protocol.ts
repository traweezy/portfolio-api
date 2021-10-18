import { BodyParams, Req, Constant, Inject } from '@tsed/common';
import { OnInstall, OnVerify, Protocol } from '@tsed/passport';
import { sign, Secret } from 'jsonwebtoken';
import { Unauthorized } from '@tsed/exceptions';
import { IStrategyOptions, Strategy } from 'passport-local';
import { user as User } from '@prisma/client';
import { StrategyOptions } from 'passport-jwt';

import UserModel from '../models/user';
import UserService from '../services/user-service';

@Protocol<IStrategyOptions>({
  name: 'login',
  useStrategy: Strategy,
  settings: {
    usernameField: 'email',
    passwordField: 'password',
  },
})
export default class LoginProtocol implements OnVerify, OnInstall {
  @Inject()
  private _userService!: UserService;

  @Constant('passport.protocols.jwt.settings')
  jwtSettings: Partial<StrategyOptions> = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  async $onVerify(
    @Req() request: Req,
    @BodyParams('email') email: string,
    @BodyParams('password') password: string,
  ): Promise<Partial<User>> {
    let user = await this._userService.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Unauthorized('Wrong credentials');
    }

    user = new UserModel(user);

    if (!this._userService.verifyPassword(user, password)) {
      throw new Unauthorized('Wrong credentials');
    }

    const token = this.createJwt(user as UserModel);

    user.token = token;

    return {
      id: user.id,
      token: user.token,
    };
  }

  createJwt(user: UserModel): string {
    const { issuer, audience, secretOrKey } = this.jwtSettings;
    const now = Date.now();

    return sign(
      {
        iss: issuer as string,
        aud: audience as string,
        sub: user.id,
        exp: now + 3600 * 1000,
        iat: now,
      },
      secretOrKey as Secret,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $onInstall(strategy: Strategy): void {}
}
