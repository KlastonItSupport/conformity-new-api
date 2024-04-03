import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await dataSource.initialize();
  await dataSource.runMigrations();

  await app.listen(process.env.PORT);
}
bootstrap();
