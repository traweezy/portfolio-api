import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import SendEmailCtrl from './index';
import Server from '../../server';
import getTestingToken from '../../utils/get-testing-token';

describe('Given SendEmailCtrl', () => {
  let token: string;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  const validFrom = 'tylerschumacher635@gmail.com';
  const validTo = 'tyler.schumacher@protonmail.com';
  const validSubject = 'Test subject';
  const validText = 'Test text';

  beforeAll(async () => {
    token = await getTestingToken();
  });

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [SendEmailCtrl],
      },
    }),
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('When SendEmailCtrl.post() is called with an invalid "from" email', () => {
    const invalidFrom = 'tylerschumacher';
    it('Should then return a 400', async () => {
      const response = await request
        .post('/send-email')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: invalidFrom,
          to: validTo,
          subject: validSubject,
          text: validText,
        })
        .expect(400);
      expect(response.body.message).toEqual('Invalid "from" email address');
    });
  });

  describe('When SendEmailCtrl.post() is called with an invalid "to" email', () => {
    const invalidTo = 'tylerschumacher';
    it('Should then return a 400', async () => {
      const response = await request
        .post('/send-email')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: validFrom,
          to: invalidTo,
          subject: validSubject,
          text: validText,
        })
        .expect(400);
      expect(response.body.message).toEqual('Invalid "to" email address');
    });
  });

  describe('When SendEmailCtrl.post() is called with valid fields', () => {
    it('Should then return a 204', async () => {
      await request
        .post('/send-email')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: validFrom,
          to: validTo,
          subject: validSubject,
          text: validText,
        })
        .expect(204);
    });
  });
});
