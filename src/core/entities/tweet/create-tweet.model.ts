import { HashTagModel } from "../hashtag/hashtag.model";

export class CreateTweetModel {
  text: string;
  image?: string;
  hashtags?: number[];
}