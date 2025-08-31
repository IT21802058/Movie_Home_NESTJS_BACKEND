import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../utils/constants';
import { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
            getRequest: () => ({}),
        }),
    } as any as ExecutionContext;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new RolesGuard(reflector);
    });

    it('should allow if no roles defined', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
        expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should deny if user not in request', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
        jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
            getRequest: () => ({ user: undefined }),
        } as any);

        expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should deny if user role does not match', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
        jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
            getRequest: () => ({ user: { role: UserRole.USER } }),
        } as any);

        expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should allow if role matches', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);
        jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
            getRequest: () => ({ user: { role: UserRole.USER } }),
        } as any);

        expect(guard.canActivate(mockContext)).toBe(true);
    });
});