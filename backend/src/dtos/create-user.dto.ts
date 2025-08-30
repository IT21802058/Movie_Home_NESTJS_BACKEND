import {IsEmail, IsEnum, IsString, MinLength} from "class-validator";
import {UserRole} from "../utils/constants";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role?: UserRole;
}