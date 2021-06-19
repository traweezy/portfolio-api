import { PlatformTest } from '@tsed/common';
import SendEmailCtrl from './index';

describe('Given SendEmailCtrl', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('It should exist', () => {
    const instance = PlatformTest.get<SendEmailCtrl>(SendEmailCtrl);

    expect(instance).toBeInstanceOf(SendEmailCtrl);
  });
});
