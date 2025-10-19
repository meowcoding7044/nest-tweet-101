import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  hashtags?: number[];
}
