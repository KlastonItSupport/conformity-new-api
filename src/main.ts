import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './database';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();
console.log('Starting...');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await dataSource.initialize();
  await dataSource.runMigrations();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
