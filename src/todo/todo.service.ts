import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todos: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, currentUser: User) {
    const todo = this.todos.create({
      ...createTodoDto,
      userId: currentUser.id,
    });

    return this.todos.save(todo);
  }

  async findAll(userId: number): Promise<Todo[]> {
    return this.todos.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo | undefined> {
    return this.todos.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async update(
    id: number,
    userId: number,
    data: Partial<Todo>,
  ): Promise<Todo | undefined> {
    const todo = await this.findOne(id, userId);
    if (todo) {
      Object.assign(todo, data);

      return this.todos.save(todo);
    }

    return undefined;
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);

    if (todo) {
      await this.todos.remove(todo);
    }
  }
}
