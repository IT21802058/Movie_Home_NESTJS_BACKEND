import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, NotFoundException, Param, ParseUUIDPipe, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UsersService} from "./users.service";
import {Roles} from "../decorators/roles.decorator";
import {UserRole} from "../utils/constants";

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Roles(UserRole.ADMIN)
    @Get()
    @ApiResponse({ status: 200, description: 'List all users' })
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map(({ password, ...u }) => u);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Get user by ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...result } = user;
        return result;
    }
}