import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import SendEmailController from './index';
import Server from '../../server';

describe('Given SendEmailController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  const validFrom = 'tylerschumacher635@gmail.com';
  const validTo = 'tyler.schumacher@protonmail.com';
  const validSubject = 'Test subject';
  const validText = 'Test text';

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [SendEmailController],
      },
    }),
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('When SendEmailController.post() is called with an invalid "from" email', () => {
    const invalidFrom = 'tylerschumacher';
    it('Should then return a 400', async () => {
      const response = await request
        .post('/send-email')
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

  describe('When SendEmailController.post() is called with an invalid "to" email', () => {
    const invalidTo = 'tylerschumacher';
    it('Should then return a 400', async () => {
      const response = await request
        .post('/send-email')
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

  describe('When SendEmailController.post() is called with valid fields', () => {
    it('Should then return a 204', async () => {
      await request
        .post('/send-email')
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
