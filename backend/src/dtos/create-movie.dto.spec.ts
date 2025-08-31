import { validate } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

describe('CreateMovieDto', () => {
    it('should pass validation with valid data', async () => {
        const dto = new CreateMovieDto();
        dto.title = 'Inception';
        dto.description = 'A mind-bending thriller';
        dto.director = 'Nolan';
        dto.genres = ['Sci-Fi', 'Action'];
        dto.releaseYear = 2010;
        dto.imageUrl = 'https://example.com/inception.jpg';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail if title is too short', async () => {
        const dto = new CreateMovieDto();
        dto.title = 'A';
        // ... fill rest

        const errors = await validate(dto);
        expect(errors.some(e => e.property === 'title')).toBeTruthy();
    });

    it('should fail if releaseYear is not a number', async () => {
        const dto = new CreateMovieDto();
        (dto.releaseYear as any) = 'invalid';

        const errors = await validate(dto);
        expect(errors.some(e => e.property === 'releaseYear')).toBeTruthy();
    });
});