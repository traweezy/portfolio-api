import {
  BodyParams,
  PathParams,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  ProviderScope,
  Scope,
} from '@tsed/common';
import { Inject } from '@tsed/di';
import { Prisma, link as Link, linkType as LinkType } from '@prisma/client';
import { Groups, Returns, Summary, Name } from '@tsed/schema';
import { Authenticate } from '@tsed/passport';
import { NotFound, BadRequest } from '@tsed/exceptions';
import { LinkModel } from '../../models/link';
import LinkRepository from '../../services/link-service';
import ProjectRepository from '../../services/project-service';
import { PatchedPrismaClientKnownRequestError } from '../../types/library-patches';
import bearerAuth from '../../decorators/bearer-auth-decorator';

@Controller('/link')
@Scope(ProviderScope.SINGLETON)
@Name('Link')
export default class LinkCtrl {
  @Inject()
  protected service!: LinkRepository;

  @Inject()
  protected projectService!: ProjectRepository;

  @Get()
  @Summary('Get all links')
  @(Returns(200, Array).Of(LinkModel).Description('Returns a list of links'))
  async getAll(): Promise<Array<Link>> {
    return this.service.findMany();
  }

  @Get('/:id')
  @Summary('Get a link')
  @(Returns(200, LinkModel).Description('Return the link with given ID'))
  async get(@PathParams('id') id: number): Promise<Link | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    const uniquelink = (await this.service.findUnique({
      where: { id },
    })) as Link;
    if (!uniquelink) {
      throw new NotFound('Link with given ID does not exist');
    }
    return uniquelink;
  }

  @Post()
  @Authenticate('jwt')
  @Summary('Create a new link')
  @bearerAuth()
  @Returns(201, LinkModel)
  async create(@BodyParams() @Groups('creation') link: Link): Promise<Link> {
    if (!(link?.type in LinkType)) {
      throw new BadRequest(
        'A valid link type must be provided: [GITHUB, SWAGGER, PLAYGROUND, LIVE]',
      );
    }
    if (!link?.url) {
      throw new BadRequest('A valid url must be provided');
    }
    if (!link?.projectId) {
      throw new BadRequest('Project ID must be provided');
    }
    const matchingProject = await this.projectService.findUnique({
      where: { id: link.projectId },
    });
    if (!matchingProject) {
      throw new BadRequest('Project ID does not match an existing project');
    }
    if (!link?.projectId) {
      throw new BadRequest('Project ID must be provided');
    }
    return this.service.create({ data: link });
  }

  @Put('/:id')
  @Authenticate('jwt')
  @Summary('Update link')
  @bearerAuth()
  @(Returns(200, LinkModel).Description('Returns updated link'))
  @(Returns(400).Description('Given ID is not a number'))
  @(Returns(404).Description('link with given ID does not exist'))
  async update(
    @PathParams('id') id: number,
    @BodyParams('type') type?: string,
    @BodyParams('url') url?: string,
    @BodyParams('projectId') projectId?: number,
  ): Promise<Link | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    if (!type && !url && !projectId) {
      throw new BadRequest(
        'Type, description, and/or projectId must be provided',
      );
    }
    if (type && !(type in LinkType)) {
      throw new BadRequest(
        'A valid link type must be provided: [GITHUB, SWAGGER, PLAYGROUND, LIVE]',
      );
    }
    if (projectId) {
      const matchingProject = await this.projectService.findUnique({
        where: { id: projectId },
      });
      if (!matchingProject) {
        throw new BadRequest('Project ID does not match an existing project');
      }
    }
    try {
      return (await this.service.update({
        where: { id },
        data: { type: type as LinkType, url, projectId },
      })) as Link;
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
  @Authenticate('jwt')
  @Summary('Delete link')
  @(Returns(200, LinkModel).Description('Return the deleted link'))
  @(Returns(400).Description('Given ID is not a number'))
  @(Returns(404).Description('link with given ID does not exist'))
  async delete(@PathParams('id') id: number): Promise<Link | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    try {
      return (await this.service.delete({
        where: { id },
      })) as Link;
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
