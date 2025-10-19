import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { AuthorizeGuard } from 'src/common/guards/authorize.guard';

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
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
   deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
