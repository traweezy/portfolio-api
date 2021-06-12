import { project } from '@prisma/client';
import { Name, Property, Required } from '@tsed/schema';

export type Image = string | null;

@Name('Project')
export class ProjectModel implements project {
  @Property()
  id: number;

  @Required()
  @Property()
  name: string;

  @Required()
  @Property()
  description: string;

  @Property()
  image: string;
}
