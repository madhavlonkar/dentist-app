// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS explicitly allowing all origins and HTTP methods
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Start Server
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();

