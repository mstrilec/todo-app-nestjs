import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validationSchema } from './validation/validation.schema';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { dataSourceOptions } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { ConfirmationController } from './confirmation/confirmation.controller';
import { SendGridService } from './sendgrid/sendgrid.service';
import { SendGridModule } from './sendgrid/sendgrid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TodoModule,
    UsersModule,
    AuthModule,
    SendGridModule,
  ],
  controllers: [AppController, ConfirmationController],
  providers: [AppService, SendGridService],
})
export class AppModule {}
