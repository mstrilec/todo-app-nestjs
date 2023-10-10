import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

export type UserType = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      username: 'john',
      password: 'changeme',
      todos: [],
    },
    {
      id: 2,
      username: 'maria',
      password: 'guess',
      todos: [],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
