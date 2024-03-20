import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DataSource, DataSourceOptions } from 'typeorm';

export default class Database {
  static async build() {
    console.log('process.env.DB_HOST', process.env.DB_HOST);
    console.log('process.env.DB_USERNAME', process.env.DB_USERNAME);
    console.log('process.env.DB_PASSWORD', process.env.DB_PASSWORD);
    console.log('process.env.DB_NAME', process.env.DB_NAME);
    console.log('process.env.DB_PORT', process.env.DB_PORT);
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.js'],
      autoLoadEntities: false,
      synchronize: false,
      timezone: 'Z',
      migrationsRun: false,
      migrations: [`${__dirname}/migrations/{.ts,*.js}`],
    });
  }
  static buildSettings(): DataSourceOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/src/modules/**/entities/*{.ts,.js}'],
      synchronize: false,
      timezone: 'Z',
      migrationsRun: true,
      migrations: [`${__dirname}/migrations/{.ts,*.js}`],
    };
  }

  static registerEntities(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}

export const dataSource: DataSource = new DataSource(Database.buildSettings());
