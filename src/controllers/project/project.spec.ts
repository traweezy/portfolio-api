import { PlatformTest } from '@tsed/common';
import ProjectCtrl from './index';

describe('Given ProjectCtrl', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('It should exist', () => {
    const instance = PlatformTest.get<ProjectCtrl>(ProjectCtrl);

    expect(instance).toBeInstanceOf(ProjectCtrl);
  });
});
