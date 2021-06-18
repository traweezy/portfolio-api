import { PlatformTest } from '@tsed/common';
import ProjectController from './index';

describe('Given ProjectController', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('It should exist', () => {
    const instance = PlatformTest.get<ProjectController>(ProjectController);

    expect(instance).toBeInstanceOf(ProjectController);
  });
});
