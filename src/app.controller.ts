import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Request,
  Session,
  Get,
  UnauthorizedException,
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
    const user = await this.users.findUserByUsername(createUserDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!user.isEmailConfirmed) {
      console.error('User is not confirmed');

      return { error: 'User is not confirmed.' };
    }

    session.user = user;

    const token = this.authService.generateToken(user);

    return { token, user };
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

  @Post('logout')
  async logout(@Session() session: Record<string, any>, @Request() req) {
    req.session.destroy();
    req.res.clearCookie('connect.sid');

    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  getProfile(@Request() req) {
    const user = req.session.user;

    if (user) {
      if (user.isEmailConfirmed) {
        return `Welcome, ${user.username}!`;
      } else {
        return 'Your email is not confirmed yet.';
      }
    } else {
      return 'You are not logged in.';
    }
  }

  @Post('reset-password')
  async resetPassword(@Session() session: Record<string, any>) {
    const user = session.user;

    if (user && user.isEmailConfirmed) {
      await this.users.initiatePasswordReset(user.email);

      return { message: 'Password reset email sent.' };
    }

    return {
      error:
        'Password reset email could not be sent. Please check your email or account status.',
    };
  }

  @Post('reset-password/:token')
  async resetPasswordLink(
    @Body('newPassword') newPassword: string,
    @Session() session: Record<string, any>,
  ) {
    if (session.user) {
      const userEmail = session.user.email;

      if (this.users.isValidPassword(newPassword)) {
        await this.users.updatePassword(userEmail, newPassword);

        return { message: 'Password reset successful' };
      } else {
        return { error: 'Invalid password format' };
      }
    } else {
      return { error: 'User not found in session' };
    }
  }
}
