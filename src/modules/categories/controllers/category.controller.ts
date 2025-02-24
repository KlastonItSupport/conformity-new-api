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
  Response,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.services';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
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
  async deleteCategory(@Req() req, @Param('id') id, @Response() res: Res) {
    const deleted = await this.categoriesService.deleteCategory(
      req.user.companyId,
      id,
    );

    return res.set({ 'x-audit-event-complement': id }).json(deleted);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateCategory(
    @Req() req,
    @Param('id') id,
    @Body() data,
    @Response() res: Res,
  ) {
    const updatedCategory = await this.categoriesService.updateCategory(
      req.user.companyId,
      id,
      data.name,
    );

    return res
      .set({
        'x-audit-event-complement': `#${updatedCategory.id}(${updatedCategory.name})`,
      })
      .json(updatedCategory);
  }
}
