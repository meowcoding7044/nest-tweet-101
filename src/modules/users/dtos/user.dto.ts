import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { ProfileDto } from '../../profile/dtos/profile.dto';

export class UserDto {
  @IsOptional()
  id?:number;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MaxLength(24)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsOptional()
  profile?: ProfileDto;

  @IsOptional()
  @IsDate()
  createdAt?:Date

  @IsOptional()
  @IsDate()
  updatedAt?:Date
}
