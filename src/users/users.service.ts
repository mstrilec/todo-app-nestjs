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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.users.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const confirmationToken = await this.generateUniqueToken();

    const confirmationLink = `http://localhost:3000/confirmation?token=${confirmationToken}`;

    user.emailConfirmationToken = confirmationToken;

    await this.users.save(user);

    await this.sendConfirmationEmail(user.email, confirmationLink);

    return user;
  }

  async sendConfirmationEmail(to: string, confirmationLink: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: sendgridConfig.fromEmail,
      subject: 'Confirm Your Email',
      text: 'Please confirm your email by clicking the link below:',
      html: `<a href="${confirmationLink}">Confirm Your Email</a>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
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

      await this.users.save(user);

      return user;
    } else {
      return null;
    }
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
