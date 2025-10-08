import {
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashtagService: HashtagService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  tweets: { text: String; date: Date; userId: Number }[] = [
    { text: 'some tweet', date: new Date('2025-09-17'), userId: 1 },
    { text: 'some other', date: new Date('2025-09-17'), userId: 2 },
    { text: 'some more tweet', date: new Date('2025-09-17'), userId: 3 },
  ];
  public async getTweets(
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
  public async CreateTweet(createTweetDto: CreateTweetDto) {
    let user = await this.userService.FindUserById(createTweetDto.userId);
    if (!user) return;

    let hashtags = await this.hashtagService.findHashtags(
      createTweetDto.hashtags!!,
    );
    let tweet = await this.tweetRepository.create({
      ...createTweetDto,
      user,
      hashtags,
    });

    return await this.tweetRepository.save(tweet);
  }

  public async UpdateTweet(updateTweetDto: UpdateTweetDto) {
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

  public async DeleteTweet(id: number) {
    await this.tweetRepository.delete({ id: id });

    return { delete: true, id: id };
  }
}
