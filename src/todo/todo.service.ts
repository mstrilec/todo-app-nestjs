import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as schedule from 'node-schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todos: Repository<Todo>,
    private readonly usersService: UsersService,
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

  async scheduleDeadlineReminders() {
    const todos = await this.todos.find({
      where: {
        reminder: true,
      },
    });
    const now = new Date();

    todos.forEach((todo) => {
      const deadline = new Date(todo.deadline);
      const oneHourBeforeDeadline = new Date(
        deadline.getTime() - 60 * 60 * 1000,
      );

      if (oneHourBeforeDeadline > now) {
        schedule.scheduleJob(oneHourBeforeDeadline, async () => {
          const userId = todo.userId;
          const subject = 'Нагадування про дедлайн';
          const message = `Дедлайн для завдання "${todo.title}" закінчується через годину.`;

          const user = await this.usersService.findOne(userId);

          this.usersService.sendReminderEmail(user.email, subject, message);
        });
      }
    });
  }
}
