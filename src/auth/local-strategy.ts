import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('Received email:', username);
    console.log('Received password:', password);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      console.log('User not found or password is invalid');
      throw new UnauthorizedException();
    }
    console.log('User found:', user);
    return user;
  }
}
