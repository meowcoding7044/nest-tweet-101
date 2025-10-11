import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
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
