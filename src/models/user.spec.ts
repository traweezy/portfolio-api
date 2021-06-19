import { user as User } from '@prisma/client';
import UserModel from './user';

describe('Given UserModel', () => {
  const validuser: User = {
    id: '1',
    email: 'test email',
    password: 'test password',
    token: 'test token',
  };
  describe('When a user model is created with a valid user object', () => {
    it('Should then return a new user model', async () => {
      const userModel = new UserModel(validuser);
      expect(validuser).toEqual(userModel);
    });
  });
});
