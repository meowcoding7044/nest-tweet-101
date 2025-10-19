import { ITokenProvider } from 'src/core/interfaces/jwt-provider.interface';
import { IUsersRepository } from '../../domain/user/users-repository.interface';
import { IHashProvider } from '../../interfaces/hashing-provider.interface';
import { UserModel } from 'src/core/entities/user/user.model';
import { ConflictError } from 'src/core/errors/domain.error';
import { IAuthConfig } from 'src/core/interfaces/config-provider.interface';
import { TokenGeneratorService } from 'src/core/services/token-generator.service';

export class SignupUseCase {
  private readonly tokenGenerator: TokenGeneratorService;
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly authConfig: IAuthConfig,
  ) {
    this.tokenGenerator = new TokenGeneratorService(tokenProvider, authConfig);
  }

  async execute(dto: UserModel): Promise<UserModel> {
    const existingEmail = await this.usersRepo.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError('Email already exists', 'EMAIL_EXISTS');
    }
    const existingUsername = await this.usersRepo.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictError('Username already exists', 'USERNAME_EXISTS');
    }
    const hashedPassword = await this.hashProvider.hash(dto.password);

    const newUser: Partial<UserModel> = {
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      profile: dto.profile,
    };
    const createdUser = await this.usersRepo.createUser(newUser);
    const tokens = await this.tokenGenerator.generateTokens(
      createdUser.id!,
      createdUser.email,
    );
    return {
      ...createdUser,
      ...tokens,
    };
  }
}
