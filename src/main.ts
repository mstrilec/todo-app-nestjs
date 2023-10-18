import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as sgMail from '@sendgrid/mail';
import sendgridConfig from 'configurations/sendgrid.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  sgMail.setApiKey(sendgridConfig.apiKey);

  await app.listen(3000);
}
bootstrap();
