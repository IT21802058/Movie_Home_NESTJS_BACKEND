import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MoviesModule} from "./movies/movies.module";
import {AuthModule} from "./auth/auth.module";
import {UsersService} from "./users/users.service";
import {MoviesService} from "./movies/movie.service";
import {User} from "./users/user.entity";
import {Movie} from "./movies/movie.entity";
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import {typeOrmConfig} from "./database/data-source";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth/auth.controller";
import {MoviesController} from "./movies/movie.controller";
import {UsersController} from "./users/users.controller";

@Module({
  imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      TypeOrmModule.forFeature([User, Movie]),
      JwtModule.register({
          secret:'strong-secret-key',
          signOptions: {expiresIn: '1d'}
      }),
      ConfigModule,
      UsersModule,
      MoviesModule,
      AuthModule,
  ],
    controllers: [AuthController, MoviesController, UsersController],
  providers: [UsersService, MoviesService],
})
export class AppModule {}
