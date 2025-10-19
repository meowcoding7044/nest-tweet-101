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
import { CreateTweetDto } from './dtos/create-tweet.dto';
// import { HashtagService } from 'src/modules/hashtag/hashtag.service';
//import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { ActiveUserType } from 'src/common/interfaces/active-user-type.interface';
import { CreateTweetUseCase } from 'src/core/use-cases/tweet/create-tweet.usecase';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { HashtagRepository } from 'src/infrastructure/database/repositories/hashtag.repository';
import { TweetRepository } from 'src/infrastructure/database/repositories/tweet.repository';
import { TweetModel } from 'src/core/entities/tweet/tweet.model';
import { GetTweetsUseCase } from 'src/core/use-cases/tweet/get-tweets.usecase';
import { CreateTweetModel } from 'src/core/entities/tweet/create-tweet.model';

@Injectable()
export class TweetService {
  constructor(
    private readonly createTweetUC: CreateTweetUseCase,
    private readonly getTweetsUC: GetTweetsUseCase,
  ) {}

  async createTweet(id: number, dto: CreateTweetModel) {
    return this.createTweetUC.execute(id, dto);
  }

  async getTweets(
    id: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<TweetModel | null>> {
    return this.getTweetsUC.execute(id, paginationQueryDto);
  }
  // async updateTweet(updateTweetDto: UpdateTweetDto) {
  //   let hashtags = await this.hashtagService.findHashtags(
  //     updateTweetDto.hashtags,
  //   );
  //   let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });
  //   if (tweet) {
  //     tweet.text = updateTweetDto.text ?? tweet.text;
  //     tweet.image = updateTweetDto.image ?? tweet.image;
  //     tweet.hashtags = hashtags ?? [];

  //     return await this.tweetRepository.save(tweet);
  //   }
  //   return 'Is Not Updated!';
  // }

  async deleteTweet(id: number) {
    // await this.tweetRepo.deleteTweet(id);
    // return { delete: true, id: id };
  }
}
