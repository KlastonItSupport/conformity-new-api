import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { BlogCategory } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogCategoryDto } from '../dtos/create-blog-category.dto';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,

    private readonly usersService: UsersServices,
  ) {}

  async create(data: CreateBlogCategoryDto) {
    const category = this.blogCategoryRepository.create(data);
    return await this.blogCategoryRepository.save(category);
  }

  async delete(id: number) {
    const category = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return await this.blogCategoryRepository.remove(category);
  }

  async update(id: number, name: string) {
    const category = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    category.name = name;

    return await this.blogCategoryRepository.save(category);
  }

  async getAll(searchParams: PagesServices, companyId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const queryBuilder =
      this.blogCategoryRepository.createQueryBuilder('blogCategories');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('blogCategories.name LIKE :searchParam', {
            searchParam,
          });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('blogCategories.companyId = :companyId', {
        companyId,
      });
    }
    if (searchParams.page && searchParams.pageSize) {
      searchParams.pageSize = Number(searchParams.pageSize);
      searchParams.page = Number(searchParams.page);
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [categories, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;
    const paginationLinks = buildPaginationLinks({
      data: categories,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });
    return paginationLinks;
  }
}
