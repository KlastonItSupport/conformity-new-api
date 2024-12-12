import { Module } from '@nestjs/common';
import { BlogCategoryController } from './controllers/categories.controller';
import { BlogCategoryService } from './services/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/category.entity';
import { UsersModule } from '../users/users.module';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { Blog } from './entities/blog.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory, Blog]),
    UsersModule,
    SharedModule,
  ],
  controllers: [BlogCategoryController, BlogController],
  providers: [BlogCategoryService, BlogService],
  exports: [],
})
export class BlogModule {}
