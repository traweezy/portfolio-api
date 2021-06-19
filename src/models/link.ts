import { link as Link, linkType as LinkType } from '@prisma/client';
import { Name, Property, Required, Enum } from '@tsed/schema';

export type Image = string | null;

@Name('Link')
export class LinkModel implements Link {
  constructor(link: Link) {
    this.id = link.id;
    this.type = link.type;
    this.url = link.url;
    this.projectId = link.projectId;
  }

  @Property()
  id: number;

  @Enum(LinkType)
  @Required()
  @Property()
  type: LinkType;

  @Required()
  @Property()
  url: string;

  @Property()
  @Required()
  projectId: number;
}
