import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { LoginUseCase } from 'src/core/use-cases/auth/login.usecase';
import { SignupUseCase } from 'src/core/use-cases/auth/signup.usecase';
import { RefreshTokenUseCase } from 'src/core/use-cases/auth/refresh-token.usecase';
import {
  InvalidTokenError,
  UserNotFoundError,
} from 'src/core/errors/auth.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly signupUC: SignupUseCase,
    private readonly refreshTokenUC: RefreshTokenUseCase,
  ) {}

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
