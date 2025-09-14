import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {RolesGuard} from "../guards/roles.guard";
import * as process from "process";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret:"ascascasdcvqeqwedvc65454564564dc654654csdc4CDVDV",
            signOptions: {expiresIn: '1d'}
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}