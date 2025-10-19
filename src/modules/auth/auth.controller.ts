import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AllowAnonymous } from '../../common/decorators/allow-anonymous.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @AllowAnonymous()
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    try {
      const user = await this.authService.signup(dto);
      return { message: 'User created successfully', user };
    } catch (error: any) {
      if (error.code === 'EMAIL_EXISTS' || error.code === 'USERNAME_EXISTS') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @AllowAnonymous()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
