import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Res,
    UseGuards,
    Get,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/auth.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../dtos/create-user.dto";
import {User} from "../users/user.entity";


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created', type: User })
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.usersService.create(createUserDto);
        const { password, ...result } = user;
        return result;
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const { access_token } = await this.authService.login(user);

        response.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'lax',
            path: '/',
        });

        return { message: 'Logged in', role: user.role };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authentication');
        return { message: 'Logged out' };
    }
}