import {
  BodyParams,
  PathParams,
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from '@tsed/common';
import { Inject } from '@tsed/di';
import { Prisma, project as Project } from '@prisma/client';
import { Groups, Returns, Summary, Name } from '@tsed/schema';
import { NotFound, BadRequest } from '@tsed/exceptions';
import { ProjectModel } from '../../models/project';
import ProjectRepository from '../../services/project-service';
import { PatchedPrismaClientKnownRequestError } from '../../types/library-patches';

@Controller('/project')
@Name('Project')
export default class ProjectController {
  @Inject()
  protected service: ProjectRepository;

  @Get()
  @Summary('Get all projects')
  @(Returns(200, Array)
    .Of(ProjectModel)
    .Description('Return a list of Project'))
  getAll(): Promise<Array<Project>> {
    return this.service.findMany();
  }

  @Get('/:id')
  @Summary('Get a project')
  @(Returns(200, ProjectModel).Description('Return the project with given ID'))
  async get(@PathParams('id') id: number): Promise<Project | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    const uniqueProject = (await this.service.findUnique({
      where: { id },
    })) as Project;
    if (!uniqueProject) {
      throw new NotFound('Project with given ID does not exist');
    }
    return uniqueProject;
  }

  @Post()
  @Summary('Create a new project')
  @Returns(201, ProjectModel)
  async create(
    @BodyParams() @Groups('creation') project: Project,
  ): Promise<Project> {
    if (!project?.name) {
      throw new BadRequest('Name must be provided');
    }
    if (!project?.description) {
      throw new BadRequest('Description must be provided');
    }
    return this.service.create({ data: project });
  }

  @Put('/:id')
  @Summary('Update project')
  @(Returns(200, ProjectModel).Description('Returns updated project'))
  @(Returns(400).Description('Given ID is not a number'))
  @(Returns(404).Description('Project with given ID does not exist'))
  async update(
    @PathParams('id') id: number,
    @BodyParams('name') name?: string,
    @BodyParams('description') description?: string,
    @BodyParams('image') image?: string,
  ): Promise<Project | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    if (!name && !description && !image) {
      throw new BadRequest('Name, description, or image must be provided');
    }
    try {
      return (await this.service.update({
        where: { id },
        data: { name, description, image },
      })) as Project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFound(
          (error as PatchedPrismaClientKnownRequestError)?.meta?.cause,
        );
      }
    }
    return undefined;
  }

  @Delete('/:id')
  @Summary('Delete project')
  @(Returns(200, ProjectModel).Description('Return the deleted project'))
  @(Returns(400).Description('Given ID is not a number'))
  @(Returns(404).Description('Project with given ID does not exist'))
  async delete(@PathParams('id') id: number): Promise<Project | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    try {
      return (await this.service.delete({
        where: { id },
      })) as Project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFound(
          (error as PatchedPrismaClientKnownRequestError)?.meta?.cause,
        );
      }
    }
    return undefined;
  }
}
