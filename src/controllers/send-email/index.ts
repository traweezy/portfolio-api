/* eslint-disable class-methods-use-this */
import { Controller, Post, BodyParams } from '@tsed/common';
import { Name, Returns, Summary } from '@tsed/schema';
import { BadRequest } from '@tsed/exceptions';
import EmailService from '../../services/email-service';

@Controller('/send-email')
@Name('Send Email')
export default class SendEmailController {
  constructor(private readonly _emailService: EmailService) {}

  @Post('')
  @(Returns(204).Description('Email sent'))
  @(Returns(400).Description('Invalid "from" email address'))
  @(Returns(400).Description('Invalid "to" email address'))
  @Summary('Sends email from given email address')
  async post(
    @BodyParams('from') from: string,
    @BodyParams('to') to: string,
    @BodyParams('subject') subject: string,
    @BodyParams('text') text: string,
  ): Promise<void> {
    const [{ valid: fromIsValid }, { valid: toIsValid }] = await Promise.all([
      EmailService.validateAddress(from),
      EmailService.validateAddress(to),
    ]);
    if (!fromIsValid) {
      throw new BadRequest('Invalid "from" email address');
    }
    if (!toIsValid) {
      throw new BadRequest('Invalid "to" email address');
    }
    await this._emailService.send(from, to, subject, text);
  }
}
