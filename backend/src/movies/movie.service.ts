import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Movie} from "./movie.entity";
import {Repository} from "typeorm";
import {CreateMovieDto} from "../dtos/create-movie.dto";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    findOne(id: string): Promise<Movie | null> {
        return this.moviesRepository.findOne({ where: { id } });
    }

    create(createMovieDto: CreateMovieDto): Promise<Movie | null> {
        const movie = this.moviesRepository.create(createMovieDto);
        return this.moviesRepository.save(movie);
    }

    async update(id: string, updateMovieDto: CreateMovieDto): Promise<Movie | null> {
        await this.moviesRepository.update(id, updateMovieDto);
        return this.moviesRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.moviesRepository.delete(id);
    }
}