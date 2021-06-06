import { PlatformTest } from '@tsed/common';
import SendEmailController from './index';

describe('Given SendEmailController', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('It should do exist', () => {
    const instance = PlatformTest.get<SendEmailController>(SendEmailController);

    expect(instance).toBeInstanceOf(SendEmailController);
  });
});
