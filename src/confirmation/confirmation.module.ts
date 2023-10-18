import { Module } from '@nestjs/common';
import { ConfirmationController } from './confirmation.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ConfirmationController],
})
export class ConfirmationModule {}
