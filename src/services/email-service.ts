import { Injectable, ProviderScope, ProviderType, $log } from '@tsed/common';
import validate from 'deep-email-validator';
import { OutputFormat } from 'deep-email-validator/dist/output/output';
import nodemailer from 'nodemailer';

@Injectable({
  type: ProviderType.SERVICE,
  scope: ProviderScope.SINGLETON,
})
export default class EmailService {
  private _nodemailer = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD,
    },
  });

  static async validateAddress(address: string): Promise<OutputFormat> {
    return validate({ email: address, validateSMTP: false });
  }

  async send(
    from: string,
    to: string,
    subject?: string,
    text?: string,
  ): Promise<boolean> {
    try {
      if (typeof from !== 'string' || typeof to !== 'string') {
        return false;
      }
      if (process.env.NODE_ENV === 'production') {
        await this._nodemailer.sendMail({
          to,
          from,
          subject: subject ?? '',
          text: text ?? '',
        });
      }
      return true;
    } catch (error) {
      $log.error(error);
      return false;
    }
  }
}
