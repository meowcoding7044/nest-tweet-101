import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenModel{
    @IsNotEmpty()
    @IsString()
    refreshToken:string
}