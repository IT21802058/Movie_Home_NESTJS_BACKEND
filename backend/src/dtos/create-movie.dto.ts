import { IsString, IsNumber, IsArray, MinLength } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsString()
    director: string;

    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @IsNumber()
    releaseYear: number;

    @IsString()
    imageUrl: string;
}