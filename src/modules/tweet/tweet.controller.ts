import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';
import { userInfo } from 'os';
import { ActiveUser } from 'src/modules/auth/decorators/active-user.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get(':userid')
  getTweets(
    @Param('userid', ParseIntPipe) userid: number,
    @Query() dto: GetTweetQueryDto,
  ) {
    return this.tweetService.getTweets(userid, dto);
  }

  @Post()
  createTweet(@Body() dto: CreateTweetDto, @ActiveUser('sub') userId) {
    return this.tweetService.createTweet(dto, userId);
  }

  @Patch()
  updateTweet(@Body() dto: UpdateTweetDto) {
    return this.tweetService.updateTweet(dto);
  }

  @Delete(':id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.deleteTweet(id);
  }
}
