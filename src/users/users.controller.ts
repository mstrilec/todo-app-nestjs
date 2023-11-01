import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './roles.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id/block')
  @UseGuards(RolesGuard)
  async blockUser(@Param('id') id: string) {
    return this.userService.blockUser(+id);
  }

  @Patch(':id/unblock')
  @UseGuards(RolesGuard)
  async unblockUser(@Param('id') id: string) {
    return this.userService.unblockUser(+id);
  }

  @Patch(':id/edit')
  @UseGuards(RolesGuard)
  async editUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.editUser(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
