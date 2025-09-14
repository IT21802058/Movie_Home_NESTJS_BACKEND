import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MoviesModule} from "./movies/movies.module";
import {AuthModule} from "./auth/auth.module";
import {UsersService} from "./users/users.service";
import {MoviesService} from "./movies/movie.service";
import {User} from "./users/user.entity";
import {Movie} from "./movies/movie.entity";
import {UsersModule} from "./users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth/auth.controller";
import {MoviesController} from "./movies/movie.controller";
import {UsersController} from "./users/users.controller";

@Module({
    imports: [
        // ✅ Load .env file
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', // Optional: specify path
        }),

        // ✅ Async TypeORM config
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<'mysql'>('DB_TYPE'),
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [User, Movie],
                synchronize: true, // ❌ Set to false in production
                logging: true,
            }),
        }),

        // Feature modules
        TypeOrmModule.forFeature([User, Movie]),
        UsersModule,
        MoviesModule,
        AuthModule,

        // JWT Module
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthController, MoviesController, UsersController],
    providers: [UsersService, MoviesService],
})
export class AppModule {}