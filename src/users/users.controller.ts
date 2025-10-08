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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getUser(@Query() pageQueryDto:PaginationQueryDto) {
    return this.usersService.getUsers(pageQueryDto);
  }
  
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.FindUserById(id);
  }

  // @Get('/:isMarried')
  // getUsers() {
  //   this.usersService.getUsers();
  // }
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Patch()
  updateUser(@Body() user: UpdateUserDto) {
    console.log('updateUser user : ', user);
    return 'User Updated successfully!';
  }

  @Delete(":id")
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
