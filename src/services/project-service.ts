import { Inject, Injectable } from '@tsed/di';
import { Prisma, project as Project } from '@prisma/client';
import PrismaService from './prisma-service';

@Injectable()
export default class ProjectRepository {
  @Inject()
  prisma: PrismaService;

  async findUnique(
    args: Prisma.projectFindUniqueArgs,
  ): Promise<Project | null> {
    return this.prisma.project.findUnique(args);
  }

  async findMany(args?: Prisma.projectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany(args);
  }

  async create(args: Prisma.projectCreateArgs): Promise<Project> {
    return this.prisma.project.create(args);
  }

  async update(args: Prisma.projectUpdateArgs): Promise<Project> {
    return this.prisma.project.update(args);
  }

  async delete(
    args: Prisma.projectDeleteArgs,
  ): Promise<Project | Prisma.PrismaClientKnownRequestError> {
    return this.prisma.project.delete(args);
  }
}
