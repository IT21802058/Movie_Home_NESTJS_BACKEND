import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../utils/constants';
import {MoviesService} from "./movie.service";
import {CreateMovieDto} from "../dtos/create-movie.dto";

@Controller('movies')
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @Get()
    findAll() {
        return this.moviesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.moviesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateMovieDto: CreateMovieDto,
    ) {
        return this.moviesService.update(id, updateMovieDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.moviesService.remove(id);
    }
}