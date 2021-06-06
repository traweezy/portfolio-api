import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import Server from './server';

describe('Server', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it('should call GET /rest', async () => {
    await request.get('/rest').expect(200);
  });
});
