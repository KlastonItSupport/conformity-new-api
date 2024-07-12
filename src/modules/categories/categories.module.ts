import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoriesService } from './services/categories.services';
import { Document } from '../documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Document])],
  providers: [CategoriesService],
  controllers: [CategoryController],
  exports: [TypeOrmModule.forFeature([Category]), CategoriesService],
})
export class CategoriesModule {}
