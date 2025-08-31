import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Movie} from "../movies/movie.entity";
import {User} from "../users/user.entity";
import * as process from "process";

console.log("hi")
console.log(process.env.DB_TYPE)
console.log("hi")
export const typeOrmConfig: TypeOrmModuleOptions ={
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Movie, User],
    synchronize: true,
}