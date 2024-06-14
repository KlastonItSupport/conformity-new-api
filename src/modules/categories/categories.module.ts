import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoriesService } from './services/categories.services';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoryController],
  exports: [TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
