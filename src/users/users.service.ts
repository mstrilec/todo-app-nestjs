import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as sgMail from '@sendgrid/mail';
import * as crypto from 'crypto';
import sendgridConfig from 'configurations/sendgrid.config';
import { SendGridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    private sendGridService: SendGridService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const confirmationToken = await this.generateUniqueToken();
    const confirmationLink = `${process.env.baseUrl}/confirmation?token=${confirmationToken}`;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.users.create({
      ...createUserDto,
      password: hashedPassword,
      emailConfirmationToken: confirmationToken,
    });

    await this.users.save(user);

    await this.sendGridService.sendEmail(
      createUserDto.email,
      'Confirm Your Email',
      'Please confirm your email by clicking the link below:',
      `<a href="${confirmationLink}">Confirm Your Email</a>`,
    );

    return user;
  }

  async generateUniqueToken() {
    const buffer = crypto.randomBytes(32);

    const token = buffer.toString('hex');

    return token;
  }

  async confirmEmail(token: string) {
    const user = await this.users.findOne({
      where: { emailConfirmationToken: token },
    });

    if (user) {
      user.isEmailConfirmed = true;

      user.emailConfirmationToken = null;

      await this.users.save(user);

      return 'Email confirmation successful.';
    } else {
      return 'Invalid confirmation token.';
    }
  }

  async findByEmailConfirmationToken(token: string): Promise<User | undefined> {
    return this.users.findOne({
      where: { emailConfirmationToken: token },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.users.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    console.log(this.users);

    const user = await this.users.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User with the provided email does not exist',
      );
    }

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.users.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User with the provided username does not exist',
      );
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
