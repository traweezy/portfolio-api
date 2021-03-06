import { project as Project } from '@prisma/client';
import { ProjectModel } from './project';

describe('Given ProjectModel', () => {
  const validProject: Project = {
    id: 1,
    name: 'test name',
    description: 'test description',
    image: 'test image',
    technologies: ['test technology'],
    isWorkInProgress: false,
    sortIndex: 0,
  };
  describe('When a project model is created with a valid project object', () => {
    it('Should then return a new project model', async () => {
      const projectModel = new ProjectModel(validProject);
      expect(validProject).toEqual(projectModel);
    });
  });
});
