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
  async create(@Req() req, @Body() createTodoDto: CreateTodoDto) {
    const currentUser = req.user;

    const todo = await this.todoService.create(createTodoDto, currentUser);
    return todo;
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    const todos = await this.todoService.findAll(userId);
    return todos;
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    const todo = await this.todoService.findOne(id, userId);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() body) {
    const userId = req.user.id;
    const todo = await this.todoService.update(id, userId, body);
    if (!todo) {
      return { message: 'Todo not found' };
    }
    return todo;
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    await this.todoService.remove(id, userId);
    return { message: 'Todo deleted' };
  }
}
