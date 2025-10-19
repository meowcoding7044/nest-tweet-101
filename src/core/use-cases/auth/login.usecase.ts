import { IUsersRepository } from '../../domain/user/users-repository.interface';
import { IHashProvider } from '../../interfaces/hashing-provider.interface';
import { ITokenProvider } from '../../interfaces/jwt-provider.interface';
import { AuthError } from '../../errors/auth.error';
import { IAuthConfig } from 'src/core/interfaces/config-provider.interface';
import { TokenGeneratorService } from 'src/core/services/token-generator.service';

export class LoginUseCase {
  private readonly tokenGenerator: TokenGeneratorService;
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly authConfig: IAuthConfig,
  ) {
    this.tokenGenerator = new TokenGeneratorService(tokenProvider, authConfig);
  }

  async execute(username: string, password: string) {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw AuthError.InvalidCredentials();

    const valid = await this.hashProvider.compare(password, user.password);
    if (!valid) throw AuthError.InvalidCredentials();

    const tokens = await this.tokenGenerator.generateTokens(
      user.id!,
      user.email,
    );
    return {
      user,
      ...tokens,
    };
  }
}
