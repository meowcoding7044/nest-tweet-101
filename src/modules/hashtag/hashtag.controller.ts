import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dtos/create-hashtag.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get('')
  getHashtags(@Query() pageQueryDto: PaginationQueryDto) {
    return this.hashtagService.getHashtags(pageQueryDto)
  }
  @Post('')
  createNewHashtag(@Body() dto: CreateHashtagDto) {
    return this.hashtagService.createHashtag(dto);
  }

  @Delete(':id')
  deleteHashTag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.deleteHashTag(id);
  }

  @Delete('soft-delete/:id')
  softDeleteHashTag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.softDeleteHashTag(id);
  }
}
