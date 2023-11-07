import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(
    createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.usersService.findUserByEmail(createUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    session.user = user;

    const token = this.generateToken(user);

    return { token, user };
  }

  private generateToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}
