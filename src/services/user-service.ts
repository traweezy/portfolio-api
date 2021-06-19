import { Inject, Injectable } from '@tsed/di';
import { Prisma, user as User } from '@prisma/client';
import PrismaService from './prisma-service';

@Injectable()
export default class UserRepository {
  @Inject()
  private _prisma!: PrismaService;

  async findUnique(args: Prisma.userFindUniqueArgs): Promise<User | null> {
    return this._prisma.user.findUnique(args);
  }

  async findMany(args?: Prisma.userFindManyArgs): Promise<User[]> {
    return this._prisma.user.findMany(args);
  }

  async create(args: Prisma.userCreateArgs): Promise<User> {
    return this._prisma.user.create(args);
  }

  async update(args: Prisma.userUpdateArgs): Promise<User> {
    return this._prisma.user.update(args);
  }

  async delete(
    args: Prisma.userDeleteArgs,
  ): Promise<User | Prisma.PrismaClientKnownRequestError> {
    return this._prisma.user.delete(args);
  }

  verifyPassword(user: User, password: string): boolean {
    return user.password === password;
  }
}
