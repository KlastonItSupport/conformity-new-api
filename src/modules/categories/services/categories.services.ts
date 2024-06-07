import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(data: CreateCategoryDto) {
    const category = this.categoriesRepository.create(data);
    const savedCategory = await this.categoriesRepository.save(category);
    return savedCategory;
  }

  async findAll(companyId: string) {
    return this.categoriesRepository.find({ where: { companyId } });
  }
}
