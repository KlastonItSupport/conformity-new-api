import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  getAll(@Req() req, @Query() data) {
    return this.categoriesService.findAll(req.user.companyId, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCategory(@Req() req, @Param('id') id) {
    return this.categoriesService.deleteCategory(req.user.companyId, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateCategory(@Req() req, @Param('id') id, @Body() data) {
    return this.categoriesService.updateCategory(
      req.user.companyId,
      id,
      data.name,
    );
  }
}
