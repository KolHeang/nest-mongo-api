import { IsEmail, IsString, MinLength, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsOptional()
    roles?: string[];
}