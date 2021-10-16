import { project as Project, link as Link } from '@prisma/client';
import { Name, Property, Required } from '@tsed/schema';

export type Image = string | null;

@Name('Project')
export class ProjectModel implements Project {
  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.image = project.image;
    this.technologies = project.technologies;
  }

  @Property()
  id: number;

  @Required()
  @Property()
  name: string;

  @Required()
  @Property()
  description: string;

  @Property()
  image: Image;

  @Property()
  technologies: string[];

  @Property()
  links: Link[] | undefined;
}
