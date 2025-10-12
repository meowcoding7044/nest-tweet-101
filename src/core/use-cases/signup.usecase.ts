import { IUsersRepository } from '../interfaces/users-repository.interface';
import { IHashProvider } from '../interfaces/hashing-provider.interface';
import { CreateUserModel } from '../entities/create-user.model';
import { ConflictException } from '@nestjs/common';

export class SignupUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly hashingProvider: IHashProvider,
  ) {}

  async execute(createUser: CreateUserModel) {
    const existing = await this.usersRepo.findByUsername(createUser.username);
    if (existing) throw new ConflictException('Username already exists');

    const hashed = await this.hashingProvider.hashPassword(createUser.password);
    return this.usersRepo.createUser({
      ...createUser,
      password: hashed,
    });
  }
}
