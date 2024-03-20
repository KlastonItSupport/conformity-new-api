import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from './database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), Database.build()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
