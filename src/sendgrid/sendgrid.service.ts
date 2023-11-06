import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import sendgridConfig from 'configurations/sendgrid.config';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(sendgridConfig.apiKey);
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const msg = {
      to,
      from: sendgridConfig.fromEmail,
      subject,
      text,
      html,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
