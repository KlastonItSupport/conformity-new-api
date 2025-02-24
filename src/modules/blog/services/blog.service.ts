import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { AppError } from 'src/errors/app-error';
import { JSDOM } from 'jsdom';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    private readonly s3Service: S3Service,
    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, companyId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.category', 'category')
      .orderBy('blog.created_at', 'DESC');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('blog.title LIKE :searchParam', {
            searchParam,
          }).orWhere('blog.text LIKE :searchParam', {
            searchParam,
          });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('blog.companyId = :companyId', {
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

    const [blogs, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: blogs,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    paginationLinks.items = paginationLinks.items.map((blog) =>
      this.format(blog),
    );
    return paginationLinks;
  }

  async create(data: CreateBlogDto) {
    const blog = this.blogRepository.create(data);

    if (data.text && data.text.length > 0) {
      const dom = new JSDOM(data.text);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_COMPANIES_ID,
          companyId: data.companyId,
          id: 'empty',
          path: `${data.companyId}/companies`,
        });
        image.src = upload.link;
      }
      blog.text = dom.serialize();
    }

    const blogSaved = await this.blogRepository.save({
      ...blog,
      seo: this.slugify(data.title),
    });

    const blogOnDb = await this.blogRepository.findOne({
      where: { id: blogSaved.id },
      relations: ['category'],
    });

    return this.format(blogOnDb);
  }

  async update(id: number, data: Partial<CreateBlogDto>) {
    const blog = await this.blogRepository.findOne({ where: { id } });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    delete data['id'];
    delete data['companyId'];
    Object.assign(blog, data);

    if (data.text && data.text.length > 0) {
      const dom = new JSDOM(data.text);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;
        if (image.src.includes('amazonaws')) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_COMPANIES_ID,
          companyId: blog.companyId,
          id: 'empty',
          path: `${blog.companyId}/companies`,
        });
        image.src = upload.link;
      }
      blog.text = dom.serialize();
    }

    const updatedBlog = await this.blogRepository.save(blog);
    const blogOnDb = await this.blogRepository.findOne({
      where: { id: updatedBlog.id },
      relations: ['category'],
    });
    return this.format(blogOnDb);
  }

  async getPostDetails(id: number) {
    const blog = this.blogRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!blog) {
      throw new AppError('Post not found', 404);
    }

    return blog;
  }

  async delete(id: number) {
    const blog = await this.blogRepository.findOne({ where: { id } });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    return await this.blogRepository.remove(blog);
  }

  private slugify(text: string): string {
    text = text.replace(/[^\p{L}\d]+/gu, '-');
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    text = text.replace(/[^-\w]+/g, '');
    text = text.replace(/^-+/, '').replace(/-+$/, '');
    text = text.replace(/-+/g, '-');
    text = text.toLowerCase();

    return text || 'n-a';
  }

  private format(blog: Blog) {
    const formattedBlog = {
      ...blog,
      blogCategoryId: blog.category.id,
      blogCategoryName: blog.category.name,
    };

    delete formattedBlog.category;
    return formattedBlog;
  }
}
