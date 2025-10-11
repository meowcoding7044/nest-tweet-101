import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { Tweet } from '../../infrastructure/database/entities/tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/modules/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { ActiveUserType } from 'src/modules/auth/interfaces/active-user-type.interface';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashtagService: HashtagService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly paginationProvider: PaginationProvider,
  ) {}


  async getTweets(
    userId: number,
    pageQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Tweet>> {
    let user = await this.userService.FindUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with userId ${userId} is not found!`);
    }
    return await this.paginationProvider.paginateQuery(
      pageQueryDto,
      this.tweetRepository,
      { user: { id: userId } },
    );
  }
  async createTweet(createTweetDto: CreateTweetDto, userId: number) {
    let user;
    let hashtags: any = undefined;
    try {
      user = await this.userService.FindUserById(userId);
      if (!user) return;

      if (createTweetDto.hashtags) {
        hashtags = await this.hashtagService.findHashtags(
          createTweetDto.hashtags!!,
        );
      }
    } catch (error) {
      throw new RequestTimeoutException();
    }
    if (createTweetDto.hashtags?.length !== hashtags?.length) {
      throw new BadRequestException();
    }

    let tweet = await this.tweetRepository.create({
      ...createTweetDto,
      user,
      hashtags,
    });

    try {
      return await this.tweetRepository.save(tweet);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async updateTweet(updateTweetDto: UpdateTweetDto) {
    let hashtags = await this.hashtagService.findHashtags(
      updateTweetDto.hashtags,
    );
    let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });
    if (tweet) {
      tweet.text = updateTweetDto.text ?? tweet.text;
      tweet.image = updateTweetDto.image ?? tweet.image;
      tweet.hashtags = hashtags ?? [];

      return await this.tweetRepository.save(tweet);
    }
    return 'Is Not Updated!';
  }

  async deleteTweet(id: number) {
    await this.tweetRepository.delete({ id: id });
    return { delete: true, id: id };
  }
}
