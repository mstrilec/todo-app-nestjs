import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Request,
  Session,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('auth')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private users: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.login(createUserDto, session);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.users.create(createUserDto);

      return user;
    } catch (error) {
      return { error: 'Registration failed', msg: error };
    }
  }
}
