import { HashTagModel } from "../hashtag/hashtag.model";
import { UserModel } from "../user/user.model";

export class TweetModel {
  id: number;

  text: string;

  image?: string;

  createdAt: Date;

  updatedAt: Date;

  user: UserModel;

  hashtags: HashTagModel[];
}
