import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from '../dtos/document.dto';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Document } from '../entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';
import { PermissionsServices } from 'src/modules/permissions/services/permissions.service';
import { UsersServices } from 'src/modules/users/services/users.services';
import { AppError } from 'src/errors/app-error';
import { PaginationDocumentsDto } from '../dtos/pagination.dto';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Departament } from 'src/modules/departaments/entities/departament.entity';

import { Company } from 'src/modules/companies/entities/company.entity';
import { SearchSelectsDto } from '../dtos/search-selects.dto';
import { Upload } from 'src/modules/shared/entities/upload.entity';
import { AdditionalDocumentsPayloadDto } from '../dtos/additional-documents-payload.dto';
import { getFileTypeFromBase64 } from 'src/helpers/files';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    @InjectRepository(Departament)
    private readonly departamentsRepository: Repository<Departament>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    private readonly permissionsService: PermissionsServices,
    private readonly usersService: UsersServices,
    private readonly s3Service: S3Service,
  ) {}

  async getDocuments(
    companyId: string,
    userId: string,
    page: number = 1,
    limit: number = 5,
    search: string = '',
    searchSelects: SearchSelectsDto = {},
  ): Promise<PaginationDocumentsDto> {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      userId,
    );

    const isAllowedToGetDocuments =
      userPermissions.canRead ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToGetDocuments) {
      throw new AppError('Not Authorized to get documents', 401);
    }

    const pagination = new PaginationDocumentsDto();

    const queryBuilder = this.documentsRepository
      .createQueryBuilder('documents')
      .leftJoinAndSelect('documents.evaluators', 'evaluators');

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('documents.document_company_fk = :companyId', {
        companyId,
      });
    }

    if (!userAccessRule.isAdmin && !userAccessRule.isSuperUser) {
      queryBuilder
        .andWhere('evaluators.document_approvals_document_id_fk = documents.id')
        .andWhere('evaluators.document_approvals_user_id_fk = :userId', {
          userId,
        });
    }

    if (search || Object.keys(searchSelects).length > 0) {
      this.handlingFilters(queryBuilder, search, searchSelects);
    }

    if (page && limit) {
      queryBuilder.offset((page - 1) * limit).limit(limit);
    }

    const documents = await queryBuilder.getManyAndCount();

    const totalDocuments = documents[1];
    const lastPage = limit ? Math.ceil(totalDocuments / limit) : 1;

    const links = {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
      currentPage: limit ? page : 1,
      previous: limit ? (page > 1 ? page - 1 : 0) : null,
      totalItems: totalDocuments,
    };

    pagination.items = documents[0];
    pagination.pages = links;

    await this.getCompanyAndDeparamentNameAndCompanyName(pagination);
    return pagination;
  }

  async createDocument(data: CreateDocumentDto, isImporting: boolean = false) {
    const document = this.documentsRepository.create({
      ...data,
    });
    if (data.description && data.description.length > 0 && !isImporting) {
      // TODO: Avaliar para o feed
      const dom = new JSDOM(data.description);
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
          moduleId: process.env.MODULE_DOCUMENTS_ID,
          companyId: data.companyId,
          id: 'empty',
          path: `${data.companyId}/documents`,
        });
        image.src = upload.link;
      }

      document.description = dom.serialize();
    }
    const savedDocument = await this.documentsRepository.save(document);

    if (data.document && data.document.length > 0 && !isImporting) {
      await Promise.all(
        data.document.map(async (file) => {
          await this.s3Service.uploadFile({
            file: Buffer.from(file.base, 'base64'),
            fileType: file.type,
            fileName: file.name,
            moduleId: process.env.MODULE_DOCUMENTS_ID,
            companyId: data.companyId,
            id: savedDocument.id,
            path: `${data.companyId}/documents`,
          });
        }),
      );
    }

    const category = this.categoriesRepository.findOne({
      where: { id: data.categoryId },
    });

    const departament = this.departamentsRepository.findOne({
      where: { id: data.departamentId },
    });

    const company = this.companiesRepository.findOne({
      where: { id: data.companyId },
    });

    await Promise.all([category, departament, company]).then(
      ([category, departament, company]) => {
        savedDocument.categoryName = category.name;
        savedDocument.departamentName = departament.name;
        savedDocument.companyName = company.name;
      },
    );

    return savedDocument;
  }

  async deleteDocument(userId: string, companyId: string, id: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      userId,
    );

    const isAllowedToDelete =
      userPermissions.canDelete ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToDelete) {
      throw new AppError('Not Authorized to delete', 401);
    }

    const document = await this.documentsRepository.findOne({
      where: { id, companyId },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const removedDocument = await this.documentsRepository.remove(document);

    return removedDocument;
  }

  async updateDocument(
    userId: string,
    companyId: string,
    id: string,
    data: Document,
  ) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      userId,
    );

    const isAllowedToUpdate =
      userPermissions.canEdit ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToUpdate) {
      throw new AppError('Not Authorized to update', 401);
    }

    const document = await this.documentsRepository.findOne({
      where: { id, companyId },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // delete data.revision;
    delete data.projectId;

    Object.assign(document, data);

    if (data.description && data.description.length > 0) {
      const dom = new JSDOM(data.description);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const imageIsAlreadyOnUploaded = image.src.startsWith('https');
        if (!imageIsAlreadyOnUploaded) {
          const base64Data = image.src.split(';base64,').pop();
          if (!base64Data) continue;

          const fileType = getFileTypeFromBase64(image.src);
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = uuidv4();

          const upload = await this.s3Service.uploadFile({
            file: buffer,
            fileType: fileType,
            fileName: fileName,
            moduleId: process.env.MODULE_DOCUMENTS_ID,
            companyId: document.companyId,
            id: 'empty',
            path: `${document.companyId}/documents`,
          });
          image.src = upload.link;
        }
      }
      document.description = dom.serialize();
    }
    if (data.document && data.document.length > 0) {
      await Promise.all(
        data.document.map(async (file) => {
          await this.s3Service.uploadFile({
            file: Buffer.from(file.base, 'base64'),
            fileType: file.type,
            fileName: file.name,
            moduleId: process.env.MODULE_DOCUMENTS_ID,
            companyId: document.companyId,
            id: document.id,
            path: `${document.companyId}/documents`,
          });
        }),
      );
    }
    const documentEditedSaved = await this.documentsRepository.save(document);

    return documentEditedSaved;
  }

  async getCompanyAndDeparamentNameAndCompanyName(
    pagination: PaginationDocumentsDto,
  ) {
    await Promise.all(
      pagination.items.map(async (document) => {
        const categoryNamePromise = this.categoriesRepository.findOne({
          where: { id: document.categoryId },
        });

        const departamentNamePromise = this.departamentsRepository.findOne({
          where: { id: document.departamentId },
        });

        const companyNamePromise = this.companiesRepository.findOne({
          where: { id: document.companyId },
        });

        const [categoryName, departamentName, companyName] = await Promise.all([
          categoryNamePromise,
          departamentNamePromise,
          companyNamePromise,
        ]);

        if (document.categoryId) {
          document.categoryName = categoryName ? categoryName.name : null;
        }
        document.departamentName = departamentName
          ? departamentName.name
          : null;
        document.companyName = companyName ? companyName.name : null;
      }),
    );
  }

  async createAdditionalDocument(data: AdditionalDocumentsPayloadDto) {
    const userAccessRule = await this.usersService.getUserAccessRule(
      data.userId,
    );

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      data.userId,
    );

    const isAllowedToUpdate =
      userPermissions.canAdd ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToUpdate) {
      throw new AppError('Not Authorized to update', 401);
    }

    const savedDocument = await this.documentsRepository.findOne({
      where: { id: data.id },
    });

    if (!savedDocument) {
      throw new AppError('Document not found', 404);
    }
    const uploads = [];
    if (data.documents && data.documents.length > 0) {
      await Promise.all(
        data.documents.map(async (file) => {
          const res = await this.s3Service.uploadFile({
            file: Buffer.from(file.base, 'base64'),
            fileType: file.type,
            fileName: file.name,
            moduleId: process.env.MODULE_DOCUMENTS_ID,
            companyId: savedDocument.companyId,
            id: savedDocument.id,
            path: `${savedDocument.companyId}/documents`,
          });
          uploads.push(res);
        }),
      );
    }
    return uploads;
  }

  async deleteAdditionalDocument(
    userId: string,
    companyId: string,
    id: string,
  ) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      userId,
    );

    const isAllowedToDelete =
      userPermissions.canDelete ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToDelete) {
      throw new AppError('Not Authorized to delete', 401);
    }

    const aditionalDocument = await this.uploadRepository.findOne({
      where: { id, companyId },
    });

    if (!aditionalDocument) {
      throw new AppError('Document not found', 404);
    }

    const resS3 = await this.s3Service.deleteFile(aditionalDocument.path);

    if (resS3) {
      await this.uploadRepository.remove(aditionalDocument);
    }

    return { module: aditionalDocument.module };
  }

  async getAdditionalDocument(id: string) {
    const additionalDocuments = await this.uploadRepository.find({
      where: { moduleId: process.env.MODULE_DOCUMENTS_ID, module: id },
    });

    const document = await this.documentsRepository.findOne({
      where: { id },
    });

    const category = this.categoriesRepository.findOne({
      where: { id: document.categoryId },
    });

    const departament = this.departamentsRepository.findOne({
      where: { id: document.departamentId },
    });
    const company = this.companiesRepository.findOne({
      where: { id: document.companyId },
    });

    await Promise.all([category, departament, company]).then(
      ([category, departament, company]) => {
        document.categoryName = category.name;
        document.departamentName = departament.name;
        document.companyName = company.name;
      },
    );

    return { additionalDocuments, document };
  }

  async handlingFilters(
    queryBuilder: SelectQueryBuilder<Document>,
    search: string,
    searchSelects: SearchSelectsDto,
  ) {
    const searchParam = { searchName: `%${search}%` };

    // Verifica se o parâmetro de pesquisa pode ser uma data no formato DD/MM/YYYY

    queryBuilder.leftJoin('documents.category', 'category');
    queryBuilder.leftJoin('documents.departament', 'departament');
    queryBuilder.leftJoin('documents.project', 'project');

    const hasSearchSelects =
      searchSelects &&
      Object.values(searchSelects).some((value) => value !== undefined);

    if (!hasSearchSelects) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('documents.id LIKE :searchName', searchParam)
            .orWhere('documents.owner LIKE :searchName', searchParam)
            .orWhere('documents.name LIKE :searchName', searchParam)
            .orWhere('documents.revision LIKE :searchName', searchParam)
            // .orWhere('documents.revision_date LIKE :searchName', searchDate)
            .orWhere('documents.validity LIKE :searchName', searchParam)
            .orWhere('category.name LIKE :searchName', searchParam)
            .orWhere('departament.name LIKE :searchName', searchParam);
        }),
      );
    } else {
      if (searchSelects.initialDate) {
        queryBuilder.andWhere('documents.revision_date >= :initialDate', {
          initialDate: searchSelects.initialDate,
        });
      }

      if (searchSelects.finalDate) {
        queryBuilder.andWhere('documents.revision_date <= :finalDate', {
          finalDate: searchSelects.finalDate,
        });
      }

      if (searchSelects.departamentId) {
        queryBuilder.andWhere(
          'documents.document_departament_fk = :departamentId',
          {
            departamentId: searchSelects.departamentId,
          },
        );
      }

      if (searchSelects.categoryId) {
        queryBuilder.andWhere('documents.document_category_fk = :categoryId', {
          categoryId: searchSelects.categoryId,
        });
      }

      if (searchSelects.projectId) {
        queryBuilder.andWhere('documents.document_project_fk = :projectId', {
          projectId: searchSelects.projectId,
        });
      }

      if (searchSelects.author) {
        queryBuilder.andWhere('documents.owner LIKE :author', {
          author: `%${searchSelects.author}%`,
        });
      }
    }
  }
}
