import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from '../../infrastructure/database/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  getAllProfiles() {
    return this.profileRepository.find({
      relations: {
        user: true,
      },
    });
  }
}
