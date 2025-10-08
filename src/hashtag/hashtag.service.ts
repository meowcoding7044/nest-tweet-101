import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  public async createHashtag(createHashtagDto: CreateHashtagDto) {
    let hashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(hashtag);
  }

  public async findHashtags(hashtags?: number[]) {
    if (!hashtags) return;
    return await this.hashtagRepository.find({
      where: { id: In(hashtags) },
    });
  }

  public async deleteHashTag(id: number) {
    await this.hashtagRepository.delete({ id });
    return { delete: true, id};
  }

  public async softDeleteHashTag(id: number) {
    await this.hashtagRepository.softDelete({ id });
    return { delete: true, id};
  }
}
