import { IUsersRepository } from '../interfaces/users-repository.interface';
import { IHashProvider } from '../interfaces/hashing-provider.interface';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import authConfig from '../../config/auth.config';

export class LoginUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly hashingProvider: IHashProvider,
    private readonly jwtService: JwtService,
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async execute(username: string, password: string) {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.hashingProvider.comparePassword(password, user.password);
    if (!valid) throw new UnauthorizedException('Incorrect password');

    return this.generateTokens(user.id!!, user.email);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        secret: this.authConfiguration.secret,
        expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateTokens(userId: number, email: string) {
    const accessToken = await this.signToken(userId, this.authConfiguration.expiresIn, { email });
    const refreshToken = await this.signToken(userId, this.authConfiguration.refreshTokenExpiresIn);
    return { token: accessToken, refreshToken };
  }
}
