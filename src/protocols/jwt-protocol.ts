import { Req } from '@tsed/common';
import { Arg, OnVerify, Protocol } from '@tsed/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user-service';
import UserModel from '../models/user';

@Protocol<StrategyOptions>({
  name: 'jwt',
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
})
class JwtProtocol implements OnVerify {
  constructor(private _userService: UserService) {}

  async $onVerify(
    @Req() req: Req,
    @Arg(0) jwtPayload: JwtPayload,
  ): Promise<UserModel | boolean> {
    const user = await this._userService.findUnique({
      where: { id: jwtPayload.sub },
    });
    return (user as UserModel) || false;
  }
}

export default JwtProtocol;
