import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  HttpCode,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req,
    @Body() createTodoDto: CreateTodoDto,
    @Session() session: Record<string, any>,
  ) {
    console.log(session.user);

    const currentUser = session.user;

    if (currentUser.isBlocked) {
      return { message: 'You are blocked. Cannot create a todo.' };
    }

    const todo = await this.todoService.create(createTodoDto, currentUser);
    return todo;
  }

  @Get()
  async findAll(@Req() req, @Session() session: Record<string, any>) {
    const userId = session.user.id;

    if (session.user.isBlocked) {
      return { message: 'You are blocked. Cannot create a todo.' };
    }

    const todos = await this.todoService.findAll(userId);

    return todos;
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;

    if (req.user.isBlocked) {
      return { message: 'You are blocked. Cannot access this todo.' };
    }

    const todo = await this.todoService.findOne(id, userId);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() body) {
    const userId = req.user.id;

    if (req.user.isBlocked) {
      return { message: 'You are blocked. Cannot access this todo.' };
    }

    const todo = await this.todoService.update(id, userId, body);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;

    if (req.user.isBlocked) {
      return { message: 'You are blocked. Cannot access this todo.' };
    }

    await this.todoService.remove(id, userId);
    return { message: 'Todo deleted' };
  }
}
