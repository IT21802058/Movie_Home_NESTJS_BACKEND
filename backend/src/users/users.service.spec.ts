// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // ← Still import
import { ConflictException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRole } from '../utils/constants';

// ✅ Add this line at the top (after imports)
jest.mock('bcryptjs');

describe('UsersService', () => {
    let service: UsersService;
    let repo: Repository<User>;

    const mockUser = {
        id: 'uuid1',
        email: 'test@movie.com',
        password: 'hashedPassword',
        role: UserRole.USER,
    };

    const mockRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get(UsersService);
        repo = module.get(getRepositoryToken(User));

        // ✅ Reset all mocks before each test
        jest.clearAllMocks();

        // ✅ Set up bcrypt.hash mock behavior
        (bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>).mockResolvedValue('hashedPassword');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user if email is unique', async () => {
            mockRepo.findOne.mockResolvedValue(null);
            mockRepo.create.mockReturnValue(mockUser);
            mockRepo.save.mockResolvedValue(mockUser);

            const result = await service.create({
                email: 'test@movie.com',
                password: '123456',
            });

            // ✅ Now this works
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
            expect(result.email).toBe('test@movie.com');
            expect(repo.save).toHaveBeenCalled();
        });

        it('should throw ConflictException if email exists', async () => {
            mockRepo.findOne.mockResolvedValue(mockUser);

            await expect(
                service.create({ email: 'test@movie.com', password: '123456' }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findOneByEmail', () => {
        it('should return user if found', async () => {
            mockRepo.findOne.mockResolvedValue(mockUser);
            const result = await service.findOneByEmail('test@movie.com');
            expect(result).toEqual(mockUser);
        });
    });
});