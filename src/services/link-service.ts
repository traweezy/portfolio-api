import { Inject, Injectable } from '@tsed/di';
import { Prisma, link as Link } from '@prisma/client';
import PrismaService from './prisma-service';

@Injectable()
export default class LinkRepository {
  @Inject()
  private _prisma!: PrismaService;

  async findUnique(args: Prisma.linkFindUniqueArgs): Promise<Link | null> {
    return this._prisma.link.findUnique(args);
  }

  async findMany(args?: Prisma.linkFindManyArgs): Promise<Link[]> {
    return this._prisma.link.findMany(args);
  }

  async create(args: Prisma.linkCreateArgs): Promise<Link> {
    return this._prisma.link.create(args);
  }

  async update(args: Prisma.linkUpdateArgs): Promise<Link> {
    return this._prisma.link.update(args);
  }

  async delete(
    args: Prisma.linkDeleteArgs,
  ): Promise<Link | Prisma.PrismaClientKnownRequestError> {
    return this._prisma.link.delete(args);
  }
}
