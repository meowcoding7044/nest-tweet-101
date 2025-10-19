import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { IHashProvider } from 'src/core/interfaces/hashing-provider.interface';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { LoginUseCase } from 'src/core/use-cases/auth/login.usecase';
import { SignupUseCase } from 'src/core/use-cases/auth/signup.usecase';
import { RefreshTokenUseCase } from 'src/core/use-cases/auth/refresh-token.usecase';
import type { IUsersRepository } from 'src/core/domain/user/users-repository.interface';
import type { ITokenProvider } from 'src/core/interfaces/jwt-provider.interface';
import type { IAuthConfig } from 'src/core/interfaces/config-provider.interface';
import {
  InvalidTokenError,
  UserNotFoundError,
} from 'src/core/errors/auth.error';
import {
  AUTH_CONFIG,
  HASH_PROVIDER,
  TOKEN_PROVIDER,
  USERS_REPOSITORY
} from 'src/common/constants/tokens';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly loginUC: LoginUseCase;
  private readonly signupUC: SignupUseCase;
  private readonly refreshTokenUC: RefreshTokenUseCase;
  constructor(
    @Inject(AUTH_CONFIG)
    private readonly authConfig: IAuthConfig,

    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,

    @Inject(HASH_PROVIDER)
    private readonly hashProvider: IHashProvider,

    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: ITokenProvider,
  ) {
    this.loginUC = new LoginUseCase(
      this.usersRepo,
      this.hashProvider,
      this.tokenProvider,
      this.authConfig,
    );
    this.signupUC = new SignupUseCase(
      this.usersRepo,
      this.hashProvider,
      this.tokenProvider,
      this.authConfig,
    );
    this.refreshTokenUC = new RefreshTokenUseCase(
      this.tokenProvider,
      this.authConfig,
      this.usersRepo,
    );
  }

  async login(username: string, password: string) {
    return this.loginUC.execute(username, password);
  }

  async signup(createUser: CreateUserDto) {
    return this.signupUC.execute(createUser);
  }

  async refreshToken(refreshToken: string) {
    try {
      return await this.refreshTokenUC.execute(refreshToken);
    } catch (err) {
      if (
        err instanceof InvalidTokenError ||
        err instanceof UserNotFoundError
      ) {
        throw new UnauthorizedException(err.message);
      }
      throw err;
    }
  }
}
