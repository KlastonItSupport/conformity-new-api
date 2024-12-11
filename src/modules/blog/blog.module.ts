import { Module } from '@nestjs/common';
import { BlogCategoryController } from './controllers/categories.controller';
import { BlogCategoryService } from './services/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/category.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory]), UsersModule],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  exports: [],
})
export class BlogModule {}
