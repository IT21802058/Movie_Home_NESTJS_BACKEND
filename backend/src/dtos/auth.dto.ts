import {IsEmail, IsEnum, IsNotEmpty, MinLength} from "class-validator";
import {UserRole} from "../utils/constants";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role?: UserRole; // Only admins can set this (we'll control in service)
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}