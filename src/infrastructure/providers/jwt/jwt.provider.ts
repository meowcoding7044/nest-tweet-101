import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ITokenProvider } from 'src/core/interfaces/jwt-provider.interface';
import type { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';

@Injectable()
export class JwtTokenProvider implements ITokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async verifyAsync<T = any>(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.authConfiguration.secret,
      audience: this.authConfiguration.audience,
      issuer: this.authConfiguration.issuer,
    });
  }

  async signAsync(payload: Record<string, any>, options: { expiresIn: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.authConfiguration.secret,
      expiresIn: options.expiresIn,
      audience: this.authConfiguration.audience,
      issuer: this.authConfiguration.issuer,
    });
  }
}
