import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private users: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.users.create(createUserDto);
      return user;
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }
}
