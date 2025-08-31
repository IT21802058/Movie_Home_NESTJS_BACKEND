import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UserRole } from '../utils/constants';
import {MoviesController} from "./movie.controller";
import {MoviesService} from "./movie.service";

describe('MoviesController', () => {
    let controller: MoviesController;
    let service: MoviesService;

    const mockMovie = {
        id: 'uuid1',
        title: 'Inception',
        description: 'Dream within dreams',
        director: 'Nolan',
        genres: ['Sci-Fi'],
        releaseYear: 2010,
        imageUrl: 'https://example.com/inception.jpg',
    };

    const mockDto: CreateMovieDto = {
        title: 'Inception',
        description: 'Dream within dreams',
        director: 'Nolan',
        genres: ['Sci-Fi'],
        releaseYear: 2010,
        imageUrl: 'https://example.com/inception.jpg',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([mockMovie]),
                        findOne: jest.fn().mockResolvedValue(mockMovie),
                        create: jest.fn().mockResolvedValue(mockMovie),
                        update: jest.fn().mockResolvedValue(mockMovie),
                        remove: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        controller = module.get(MoviesController);
        service = module.get(MoviesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all movies', async () => {
            const result = await controller.findAll();
            expect(result).toEqual([mockMovie]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one movie', async () => {
            const result = await controller.findOne('uuid1');
            expect(result).toEqual(mockMovie);
        });
    });

    describe('create', () => {
        it('should create a movie (admin only)', async () => {
            const req = { user: { role: UserRole.ADMIN } };
            const result = await controller.create(mockDto, req as any);
            expect(service.create).toHaveBeenCalledWith(mockDto);
            expect(result).toEqual(mockMovie);
        });
    });

    describe('update', () => {
        it('should update a movie', async () => {
            const result = await controller.update('uuid1', mockDto);
            expect(service.update).toHaveBeenCalledWith('uuid1', mockDto);
            expect(result).toEqual(mockMovie);
        });
    });

    describe('remove', () => {
        it('should delete a movie', async () => {
            await controller.remove('uuid1');
            expect(service.remove).toHaveBeenCalledWith('uuid1');
        });
    });
});