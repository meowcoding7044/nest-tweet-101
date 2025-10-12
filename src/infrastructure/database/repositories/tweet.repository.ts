import { Injectable } from '@nestjs/common';
import { ITweetRepository } from 'src/core/interfaces/tweet-repository.interface';


@Injectable()
export class TweetRepository implements ITweetRepository {}
