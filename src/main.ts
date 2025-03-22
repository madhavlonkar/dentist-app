// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Start Server
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
