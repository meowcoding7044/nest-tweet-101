import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import authConfig from '../../config/auth.config';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database/entities/user.entity';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findUserByUserName(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    let ok = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );
    if (!ok) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return this.generateTokens(user.id, user.email);
  }

  async signup(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async refreshToken(refreshToken: string) {
    try {
      //step 1 verify a refresh token
      const { sub } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.authConfiguration.secret,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      });
      //step 2 find a user from db using userId
      const user = await this.userService.FindUserById(sub);
      //step 3 gen a access token & refresh token
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateTokens(userId: number, email: string) {
    const accessToken = await this.signToken(
      userId,
      this.authConfiguration.expiresIn,
      { email },
    );
    const refreshToken = await this.signToken(
      userId,
      this.authConfiguration.refreshTokenExpiresIn,
    );

    return { token: accessToken, refreshToken };
  }
}
