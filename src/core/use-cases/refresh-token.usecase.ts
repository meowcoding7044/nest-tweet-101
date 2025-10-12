import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import authConfig from '../../config/auth.config';
import { IUsersRepository } from '../interfaces/users-repository.interface';

export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly usersRepo: IUsersRepository,
  ) {}

  async execute(refreshToken: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.authConfiguration.secret,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      });

      const user = await this.usersRepo.findById(sub);
      if (!user) throw new UnauthorizedException('User not found');

      return this.generateTokens(user.id!!, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
