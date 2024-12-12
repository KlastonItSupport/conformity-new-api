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
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogServices: BlogService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Query() query, @Req() req) {
    return await this.blogServices.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.companyId,
      req.user.id,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateBlogDto) {
    return await this.blogServices.create(data);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() data: Partial<CreateBlogDto>) {
    return await this.blogServices.update(id, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    return await this.blogServices.delete(id);
  }

  @Get('/details/:id')
  @UseGuards()
  async getPostDetails(@Param('id') id: number) {
    return await this.blogServices.getPostDetails(id);
  }
}
