import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('API_KEY'));
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    console.log(this.configService.get('API_KEY'));

    const msg = {
      to,
      from: this.configService.get('FROM_EMAIL'),
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
