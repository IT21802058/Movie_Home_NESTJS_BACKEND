import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '../utils/constants';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUser = {
        id: 'uuid1',
        email: 'admin@movie.com',
        role: UserRole.ADMIN,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([mockUser]),
                        findOneById: jest.fn().mockResolvedValue(mockUser),
                    },
                },
            ],
        }).compile();

        controller = module.get(UsersController);
        service = module.get(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all users (admin only)', async () => {
            const req = { user: { role: UserRole.ADMIN } };
            const result = await controller.findAll(req as any);
            expect(service.findAll).toHaveBeenCalled();
            expect(result[0].email).toBe('admin@movie.com');
        });
    });

    describe('findOne', () => {
        it('should return one user by id', async () => {
            const result = await controller.findOne('uuid1');
            expect(service.findOneById).toHaveBeenCalledWith('uuid1');
            expect(result.email).toBe('admin@movie.com');
        });
    });
});