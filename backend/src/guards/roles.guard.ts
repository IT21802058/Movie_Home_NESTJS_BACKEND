import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UserRole} from "../utils/constants";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            'roles',
            [context.getHandler(), context.getClass()],
        );

        // If no roles defined (public route), allow
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(user)
        // 🔴 If no user (not authenticated), deny
        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        // 🔴 If user exists but role doesn't match
        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}