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
  Logger.log('Using prod xxxxx');

  let httpsOptions = {};
  if (process.env.ENVIRONMENT === 'prod') {
    console.log('Using prod certs');
    httpsOptions = {
      key: fs.readFileSync(process.env.SELF_SIGNED_KEY_PATH),
      cert: fs.readFileSync(process.env.SELF_SIGNED_CRT_PATH),
    };
  } else {
    console.log('Using dev certs');
  }
  console.log('aaaaaaaa');
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });

  await dataSource.initialize();
  await dataSource.runMigrations();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
