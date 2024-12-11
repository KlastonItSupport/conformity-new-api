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
import { BlogCategoryService } from '../services/categories.service';
import { CreateBlogCategoryDto } from '../dtos/create-blog-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('blog/category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  async create(@Body() data: CreateBlogCategoryDto) {
    return await this.blogCategoryService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.blogCategoryService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data) {
    return await this.blogCategoryService.update(id, data.name);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Query() query, @Req() req) {
    return await this.blogCategoryService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.companyId,
      req.user.id,
    );
  }
}
