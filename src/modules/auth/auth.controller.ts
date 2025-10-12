import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserModel } from 'src/core/entities/create-user.model';
import { LoginModel } from '../../core/entities/login.model';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { RefreshTokenModel } from '../../core/entities/refresh-token.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginModel) {
    return this.authService.login(dto.username, dto.password);
  }

  @AllowAnonymous()
  @Post('signup')
  async signup(@Body() dto: CreateUserModel) {
    return this.authService.signup(dto);
  }

  @AllowAnonymous()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenModel) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
