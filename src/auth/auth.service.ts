import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  isAuthenticated: boolean = false;
  public async login(loginDto: LoginDto) {
    let user = await this.userService.findUserByUserName(loginDto.username);
    //this.logger.debug(`login findUserByUserName : ${JSON.stringify(user)}`);

    let isMatch = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return {
      data: user,
      success: true,
      message: 'User logged in successfully',
    };
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
