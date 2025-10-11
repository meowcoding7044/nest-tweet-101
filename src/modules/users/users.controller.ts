import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
  Body,
  ParseBoolPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { AuthorizeGuard } from 'src/modules/auth/guards/authorize.guard';

@Controller('users')
// @UseGuards(AuthorizeGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getUser(@Query() pageQueryDto: PaginationQueryDto) {
    return this.usersService.getUsers(pageQueryDto);
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.FindUserById(id);
  }

  @Delete(':id')
   deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
