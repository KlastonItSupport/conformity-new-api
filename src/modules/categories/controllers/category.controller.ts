import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.services';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(@Body() data: CreateCategoryDto) {
    return this.categoriesService.createCategory(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req) {
    return this.categoriesService.findAll(req.user.companyId);
  }
}
