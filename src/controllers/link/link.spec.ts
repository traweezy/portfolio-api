import { PlatformTest } from '@tsed/common';
import LinkCtrl from './index';

describe('Given LinkCtrl', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('It should exist', () => {
    const instance = PlatformTest.get<LinkCtrl>(LinkCtrl);

    expect(instance).toBeInstanceOf(LinkCtrl);
  });
});
