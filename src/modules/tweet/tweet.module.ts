import { forwardRef, Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '../../infrastructure/database/entities/tweet.entity';
import { HashtagModule } from 'src/modules/hashtag/hashtag.module';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { CreateTweetUseCase } from 'src/core/use-cases/tweet/create-tweet.usecase';
import { TweetRepository } from 'src/infrastructure/database/repositories/tweet.repository';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { HashtagRepository } from 'src/infrastructure/database/repositories/hashtag.repository';
import {
  HASHTAG_REPOSITORY,
  TWEETS_REPOSITORY,
  USERS_REPOSITORY,
} from 'src/common/constants/tokens';
import { GetTweetsUseCase } from 'src/core/use-cases/tweet/get-tweets.usecase';
//import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [TweetController],
  providers: [
    TweetService,
    PaginationProvider,
    {
      // provide repository implementation under a token (so core code depends on interface/token)
      provide: TWEETS_REPOSITORY,
      useClass: TweetRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    // {
    //   provide: HASHTAG_REPOSITORY,
    //   useClass: HashtagRepository,
    // },
    // UseCase providers (pure classes) created via factory so dependencies are injected properly
    {
      provide: CreateTweetUseCase,
      useFactory: (
        tweetsRepo: TweetRepository,
        usersRepo: UsersRepository,
        hashtagsRepo: HashtagRepository,
      ) => new CreateTweetUseCase(tweetsRepo, usersRepo, hashtagsRepo),
      // inject the tokens/providers that the usecase needs:
      inject: [TWEETS_REPOSITORY, USERS_REPOSITORY, HASHTAG_REPOSITORY],
    },
    {
      provide: GetTweetsUseCase,
      useFactory: (tweetsRepo: TweetRepository) =>
        new GetTweetsUseCase(tweetsRepo),
      inject: [TWEETS_REPOSITORY],
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    forwardRef(() => UsersModule),
    forwardRef(() => HashtagModule),
  ],
})
export class TweetModule {}
