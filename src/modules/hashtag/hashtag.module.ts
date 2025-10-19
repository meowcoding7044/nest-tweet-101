import { forwardRef, Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from '../../infrastructure/database/entities/hashtag.entity';
//import { CreateHashtagUseCase } from 'src/core/use-cases/hashtag/create-hashtag.usercase';
//import { GetHashtagsUseCase } from 'src/core/use-cases/hashtag/get-hashtags.usecase';
//import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashtagRepository } from 'src/infrastructure/database/repositories/hashtag.repository';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { HASHTAG_REPOSITORY } from 'src/common/constants/tokens';
import { TweetModule } from '../tweet/tweet.module';
import { CreateHashtagUseCase } from 'src/core/use-cases/hashtag/create-hashtag.usercase';
import { GetHashtagsUseCase } from 'src/core/use-cases/hashtag/get-hashtags.usecase';

@Module({
  controllers: [HashtagController],
  providers: [
    HashtagService,
    PaginationProvider,
    {
      provide: HASHTAG_REPOSITORY,
      useClass: HashtagRepository,
    },
    {
      provide: CreateHashtagUseCase,
      useFactory: (hashtagRepo: HashtagRepository) =>
        new CreateHashtagUseCase(hashtagRepo),
      inject: [HASHTAG_REPOSITORY],
    },
    {
      provide: GetHashtagsUseCase,
      useFactory: (hashtagRepo: HashtagRepository) =>
        new GetHashtagsUseCase(hashtagRepo),
      inject: [HASHTAG_REPOSITORY],
    },
  ],
  exports: [HASHTAG_REPOSITORY, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Hashtag]), forwardRef(() => TweetModule)],
})
export class HashtagModule {}
