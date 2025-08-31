import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import {MoviesService} from "./movie.service";

describe('MoviesService', () => {
    let service: MoviesService;
    let repo: Repository<Movie>;

    const mockMovie = {
        id: 'uuid1',
        title: 'Inception',
        description: 'Dream within dreams',
        director: 'Nolan',
        genres: ['Sci-Fi'],
        releaseYear: 2010,
        imageUrl: 'https://example.com/inception.jpg',
    };

    const mockRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                {
                    provide: getRepositoryToken(Movie),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get(MoviesService);
        repo = module.get(getRepositoryToken(Movie));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return array of movies', async () => {
            mockRepo.find.mockResolvedValue([mockMovie]);
            const result = await service.findAll();
            expect(result).toEqual([mockMovie]);
            expect(repo.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one movie by id', async () => {
            mockRepo.findOne.mockResolvedValue(mockMovie);
            const result = await service.findOne('uuid1');
            expect(result).toEqual(mockMovie);
        });
    });

    describe('create', () => {
        it('should create and return a movie', async () => {
            const dto: CreateMovieDto = {
                title: 'Interstellar',
                description: 'Space adventure',
                director: 'Nolan',
                genres: ['Sci-Fi'],
                releaseYear: 2014,
                imageUrl: 'https://example.com/interstellar.jpg',
            };

            mockRepo.create.mockReturnValue(mockMovie);
            mockRepo.save.mockResolvedValue(mockMovie);

            const result = await service.create(dto);
            expect(repo.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(mockMovie);
        });
    });

    describe('update', () => {
        it('should update and return updated movie', async () => {
            const dto: CreateMovieDto = { ...mockMovie, title: 'Updated' };
            mockRepo.findOne.mockResolvedValue(mockMovie);
            mockRepo.update.mockResolvedValue(undefined);

            const result = await service.update('uuid1', dto);
            expect(repo.update).toHaveBeenCalledWith('uuid1', dto);
            expect(result).toEqual(mockMovie);
        });
    });

    describe('remove', () => {
        it('should delete a movie by id', async () => {
            mockRepo.delete.mockResolvedValue({ affected: 1 });
            await service.remove('uuid1');
            expect(repo.delete).toHaveBeenCalledWith('uuid1');
        });
    });
});