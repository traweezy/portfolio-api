import { Inject, Injectable } from '@tsed/di';
import { Prisma, project as Project } from '@prisma/client';
import PrismaService from './prisma-service';

@Injectable()
export default class ProjectRepository {
  @Inject()
  private _prisma!: PrismaService;

  async findUnique(
    args: Prisma.projectFindUniqueArgs,
  ): Promise<Project | null> {
    return this._prisma.project.findUnique(args);
  }

  async findMany(args?: Prisma.projectFindManyArgs): Promise<Project[]> {
    return this._prisma.project.findMany(args);
  }

  async create(args: Prisma.projectCreateArgs): Promise<Project> {
    return this._prisma.project.create(args);
  }

  async update(args: Prisma.projectUpdateArgs): Promise<Project> {
    return this._prisma.project.update(args);
  }

  async delete(
    args: Prisma.projectDeleteArgs,
  ): Promise<Project | Prisma.PrismaClientKnownRequestError> {
    return this._prisma.project.delete(args);
  }
}
