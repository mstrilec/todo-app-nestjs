import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('confirmation')
export class ConfirmationController {
  constructor(private usersService: UsersService) {}

  @Get()
  async confirmEmail(@Query('token') token: string) {
    const user = await this.usersService.confirmEmail(token);

    if (user) {
      return 'Email Confirmation Successful. You can now log in to your account.';
    }

    return 'Invalid confirmation token';
  }
}
