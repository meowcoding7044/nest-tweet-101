import type { IUsersRepository } from '../../domain/user/users-repository.interface';
import type { IHashProvider } from '../../interfaces/hashing-provider.interface';
import { UserModel } from 'src/core/entities/user/user.model';
import { ConflictError } from 'src/core/errors/domain.error';

export class CreateUserUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(dto: UserModel): Promise<UserModel> {
    console.log('CreateUserUseCase : ', dto);
    // business validations
    const byEmail = await this.usersRepo.findByEmail(dto.email);
    if (byEmail)
      throw new ConflictError('Email already exists', 'EMAIL_EXISTS');

    const byUsername = await this.usersRepo.findByUsername(dto.username);
    if (byUsername)
      throw new ConflictError('Username already exists', 'USERNAME_EXISTS');

    const hashed = await this.hashProvider.hash(dto.password);
    const toSave: Partial<UserModel> = {
      email: dto.email,
      username: dto.username,
      password: hashed,
      profile: dto.profile,
    };
    console.log('create user save : ', toSave);

    return this.usersRepo.createUser(toSave);
  }
}
