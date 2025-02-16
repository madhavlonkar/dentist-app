// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Start Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
