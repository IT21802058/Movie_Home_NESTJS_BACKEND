import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

}