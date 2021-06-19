import { UserInfo } from '@tsed/passport';
import { user as User } from '@prisma/client';
import { Name, Property, Required } from '@tsed/schema';

@Name('Project')
export default class UserModel implements UserInfo {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.token = user.token;
  }

  @Required()
  @Property()
  id: string;

  @Required()
  @Property()
  email: string;

  @Required()
  @Property()
  password: string;

  @Property()
  token: string | null;
}
