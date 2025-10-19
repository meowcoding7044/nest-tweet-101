import { ITokenProvider } from "../interfaces/jwt-provider.interface";
import { IAuthConfig } from '../interfaces/config-provider.interface';

export class TokenGeneratorService {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly authConfig: IAuthConfig,
  ) {}


  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenProvider.signAsync(payload, {
        expiresIn: this.authConfig.expiresIn as number,
      }),
      this.tokenProvider.signAsync(payload, {
        expiresIn: this.authConfig.refreshTokenExpiresIn as number,
      }),
    ]);

    return {
      token: accessToken,
      refreshToken,
      expiresIn: this.authConfig.expiresIn,
    };
  }
}
