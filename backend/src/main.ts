import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./filters/http-exception.filter";
import * as Process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (for frontend)
  app.enableCors({
    origin: ['http://localhost:3000'], // Next.js frontend
    credentials: true,
  });

  // Parse cookies
  app.use(cookieParser());

  // Global validation pipe
  // app.useGlobalPipes(
  //     new ValidationPipe({
  //       whitelist: true,
  //       forbidNonWhitelisted: true,
  //       transform: true,
  //       exceptionFactory: (errors) => new BadRequestException(errors),
  //     }),
  // );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5000);
  console.log('Backend running on http://localhost:5000');
}
bootstrap();
