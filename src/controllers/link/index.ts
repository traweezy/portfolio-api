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
import { PatchedPrismaClientKnownRequestError } from '../../types/library-patches';
import bearerAuth from '../../decorators/bearer-auth-decorator';

import getTestingToken from '../../utils/get-testing-token';

@Controller('/link')
@Scope(ProviderScope.SINGLETON)
@Name('Link')
@Authenticate('jwt')
export default class LinkCtrl {
  @Inject()
  protected service!: LinkRepository;

  @Get()
  @Summary('Get all links')
  @bearerAuth()
  @(Returns(200, Array).Of(LinkModel).Description('Returns a list of links'))
  async getAll(): Promise<Array<Link>> {
    await getTestingToken();
    return this.service.findMany();
  }

  @Get('/:id')
  @Summary('Get a link')
  @bearerAuth()
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
  @Summary('Create a new link')
  @bearerAuth()
  @Returns(201, LinkModel)
  async create(@BodyParams() @Groups('creation') link: Link): Promise<Link> {
    if (!link?.type) {
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
    return this.service.create({ data: link });
  }

  @Put('/:id')
  @Summary('Update link')
  @bearerAuth()
  @(Returns(200, LinkModel).Description('Returns updated link'))
  @(Returns(400).Description('Given ID is not a number'))
  @(Returns(404).Description('link with given ID does not exist'))
  async update(
    @PathParams('id') id: number,
    @BodyParams('name') type?: LinkType,
    @BodyParams('description') url?: string,
    @BodyParams('image') projectId?: number,
  ): Promise<Link | void> {
    if (Number.isNaN(+id)) {
      throw new BadRequest('Given ID is not a number');
    }
    if (!type && !url && !projectId) {
      throw new BadRequest('Name, description, or image must be provided');
    }
    try {
      return (await this.service.update({
        where: { id },
        data: { type, url, projectId },
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
