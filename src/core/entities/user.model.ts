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
import { ProfileModel } from './profile.model';

export class UserModel {
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
  profile?: ProfileModel;

  @IsOptional()
  @IsDate()
  createdAt?:Date

  @IsOptional()
  @IsDate()
  updatedAt?:Date
}
