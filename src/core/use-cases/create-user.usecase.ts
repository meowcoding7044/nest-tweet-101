import { IUsersRepository } from '../interfaces/users-repository.interface';
import { IHashProvider } from '../interfaces/hashing-provider.interface';
import { UserModel } from '../entities/user.model';
import { BadRequestException } from '@nestjs/common';

export class CreateUserUseCase {
  constructor(private usersRepo: IUsersRepository, private hashProvider: IHashProvider) {}

  async execute(payload: Partial<UserModel>): Promise<UserModel> {
    if (!payload.username || !payload.email || !payload.password) {
      throw new BadRequestException('Missing required fields');
    }

    const existingUser = await this.usersRepo.findByUsername(payload.username);
    if (existingUser) throw new BadRequestException('Username already exists');

    const existingEmail = await this.usersRepo.findByEmail(payload.email);
    if (existingEmail) throw new BadRequestException('Email already exists');

    const hashed = await this.hashProvider.hashPassword(payload.password!);
    const created = await this.usersRepo.createUser({ ...payload, password: hashed });
    return created;
  }
}
