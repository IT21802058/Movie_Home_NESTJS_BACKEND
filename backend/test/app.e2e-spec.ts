import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../src/users/user.entity";
import {Movie} from "../src/movies/movie.entity";
import {AppModule} from "../src/app.module";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Movie],
          synchronize: true,
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) → should register user', () => {
    return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@movie.com',
          password: '123456',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe('test@movie.com');
        });
  });

  it('/auth/login (POST) → should login and set cookie', () => {
    const agent = request.agent(app.getHttpServer());
    return agent
        .post('/auth/login')
        .send({
          email: 'test@movie.com',
          password: '123456',
        })
        .expect(200)
        .expect('set-cookie', /Authentication=/)
        .then(() => {
          return agent
              .get('/auth/profile')
              .expect(200)
              .expect((res) => {
                expect(res.body.email).toBe('test@movie.com');
              });
        });
  });

  it('/movies (GET) → should list movies', () => {
    return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
  });
});