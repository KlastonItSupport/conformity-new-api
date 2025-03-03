import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Document } from 'src/modules/documents/entities/document.entity';
import { SearchSelectsDto } from '../dtos/search-categorioes.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async createCategory(data: CreateCategoryDto) {
    const category = this.categoriesRepository.create(data);
    const savedCategory = await this.categoriesRepository.save(category);
    return savedCategory;
  }

  async findAll(companyId: string, search?: SearchSelectsDto) {
    if ((search && search.page) || search.pageSize || search.search) {
      const queryBuilder =
        this.categoriesRepository.createQueryBuilder('categories');

      if (search.search) {
        const searchParam = `%${search.search || ''}%`;

        queryBuilder.andWhere((qb) => {
          qb.where('categories.name LIKE :searchParam', { searchParam });
        });
      }

      if (search.page && search.pageSize) {
        queryBuilder
          .offset((search.page - 1) * search.pageSize)
          .limit(search.pageSize);
      }

      const pagination = {};
      const categories = await queryBuilder.getManyAndCount();
      const totalCategories = categories[1];
      const lastPage = search.pageSize
        ? Math.ceil(totalCategories / search.pageSize)
        : 1;

      const links = {
        first: 1,
        last: lastPage,
        next: search.page + 1 > lastPage ? lastPage : search.page + 1,
        totalPages: search.pageSize
          ? Math.ceil(totalCategories / search.pageSize)
          : 1,
        currentPage: search.pageSize ? search.page : 1,
        previous: search.pageSize
          ? search.page > 1
            ? search.page - 1
            : 0
          : null,
        totalItems: totalCategories,
      };

      pagination['items'] = categories[0];
      pagination['pages'] = links;

      return pagination;
    }
    return this.categoriesRepository.find({ where: { companyId } });
  }

  async deleteCategory(companyId: string, id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id, companyId },
    });
    if (!category) {
      throw new Error('Category not found');
    }

    const documents = await this.documentsRepository.find({
      where: { categoryId: id },
    });

    await Promise.all(
      documents.map(async (document) => {
        document.categoryId = null;
        this.documentsRepository.save(document);
      }),
    );

    await this.categoriesRepository.remove(category);
    return category;
  }

  async updateCategory(companyId: string, id: string, name: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id, companyId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;
    const savedCategory = await this.categoriesRepository.save(category);

    return savedCategory;
  }
}
