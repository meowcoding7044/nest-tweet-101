import { IUsersRepository } from 'src/core/domain/user/users-repository.interface';
import { ITokenProvider } from 'src/core/interfaces/jwt-provider.interface';
import { IAuthConfig } from 'src/core/interfaces/config-provider.interface';
import { TokenGeneratorService } from 'src/core/services/token-generator.service';
import { InvalidTokenError,UserNotFoundError } from 'src/core/errors/auth.error';

export class RefreshTokenUseCase {
  private readonly tokenGenerator: TokenGeneratorService;

  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly authConfig: IAuthConfig,
    private readonly usersRepo: IUsersRepository,
  ) {
    this.tokenGenerator = new TokenGeneratorService(tokenProvider, authConfig);
  }

  async execute(refreshToken: string) {
    let payload: { sub: number; email?: string };
    try {
      payload = await this.tokenProvider.verifyAsync(refreshToken);
    } catch {
      throw new InvalidTokenError('Invalid or expired refresh token');
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new UserNotFoundError('User not found');

    return this.tokenGenerator.generateTokens(user.id!, user.email);
  }
}
