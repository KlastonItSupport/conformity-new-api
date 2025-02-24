import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './database';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './guards/interceptors/response.interceptor';

dotenv.config();
console.log('Starting...');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const responseInterceptor = app.get(ResponseInterceptor);
  app.useGlobalInterceptors(responseInterceptor);

  await dataSource.initialize();
  //await dataSource.runMigrations();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
