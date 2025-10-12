import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import authConfig from '../../config/auth.config';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { CreateUserModel } from 'src/core/entities/create-user.model';
import { LoginUseCase } from 'src/core/use-cases/login.usecase';
import { SignupUseCase } from 'src/core/use-cases/signup.usecase';
import { RefreshTokenUseCase } from 'src/core/use-cases/refresh-token.usecase';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly loginUC: LoginUseCase;
  private readonly signupUC: SignupUseCase;
  private readonly refreshTokenUC: RefreshTokenUseCase;
  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {
      this.loginUC = new LoginUseCase(
      this.usersRepo,
      this.hashingProvider,
      this.jwtService,
      this.authConfiguration,
    );
    this.signupUC = new SignupUseCase(
      this.usersRepo,
      this.hashingProvider,
    );
    this.refreshTokenUC = new RefreshTokenUseCase(
      this.jwtService,
      this.authConfiguration,
      this.usersRepo,
    );
  }

  async login(username: string, password: string) {
    return this.loginUC.execute(username, password);
  }

  async signup(createUser: CreateUserModel) {
    return this.signupUC.execute(createUser);
  }

  async refreshToken(refreshToken: string) {
    return this.refreshTokenUC.execute(refreshToken);
  }


}
