import { PlatformTest } from '@tsed/common';
import EmailService from './email-service';

describe('Given the EmailService', () => {
  let emailService: EmailService;
  const validFrom = 'tylerschumacher635@gmail.com';
  const validTo = 'tyler.schumacher@protonmail.com';
  const validSubject = 'Test subject';
  const validText = 'Test text';

  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('When validateAddress() is called with an invalid email adress', () => {
    const invalidEmailAddress = 'invalidemail.com';
    it('Then return true', async () => {
      const { valid } = await EmailService.validateAddress(invalidEmailAddress);
      expect(valid).toEqual(false);
    });
  });

  describe('When validateAddress() is called with a valid email adress', () => {
    const validEmailAddress = 'tylerschumacher@protonmail.com';
    it('Then return true', async () => {
      const { valid } = await EmailService.validateAddress(validEmailAddress);
      expect(valid).toEqual(true);
    });
  });

  describe('When send() is called with the from field as a number', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invalidFrom: any = 5;
    it('Then return false', async () => {
      const sent = await emailService.send(invalidFrom, validTo);
      expect(sent).toEqual(false);
    });
  });

  describe('When send() is called with the to field as a number', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invalidTo: any = 5;
    it('Then return false', async () => {
      const sent = await emailService.send(validFrom, invalidTo);
      expect(sent).toEqual(false);
    });
  });

  describe('When send() is called with valid fields', () => {
    it('Then return true', async () => {
      const sent = await emailService.send(
        validFrom,
        validTo,
        validSubject,
        validText,
      );
      expect(sent).toEqual(true);
    });
  });
});
