import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '../../infrastructure/database/entities/tweet.entity';
import { HashtagModule } from 'src/modules/hashtag/hashtag.module';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [TweetController],
  providers: [TweetService],
  imports: [UsersModule, HashtagModule, TypeOrmModule.forFeature([Tweet]),PaginationModule],
})
export class TweetModule {}
