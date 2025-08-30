import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MoviesController} from "./movie.controller";
import {MoviesService} from "./movie.service";
import {Movie} from "./movie.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    controllers: [MoviesController],
    providers: [MoviesService],
})
export class MoviesModule {}