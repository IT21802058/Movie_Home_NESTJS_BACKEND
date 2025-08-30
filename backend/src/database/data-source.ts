import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Movie} from "../movies/movie.entity";
import {User} from "../users/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions ={
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'movie_home',
    entities: [Movie, User],
    synchronize: true,
}