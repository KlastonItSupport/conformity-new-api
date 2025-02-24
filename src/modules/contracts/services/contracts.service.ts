import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { AppError } from 'src/errors/app-error';
import { Upload } from 'src/modules/shared/entities/upload.entity';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { UsersServices } from 'src/modules/users/services/users.services';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    private readonly s3Service: S3Service,
    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, companyId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const queryBuilder = this.contractsRepository
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.crmCompany', 'crmCompany');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('contracts.title LIKE :searchParam', {
            searchParam,
          })
            .orWhere('contracts.value LIKE :searchParam', { searchParam })
            .orWhere('contracts.details LIKE :searchParam', { searchParam })
            .orWhere('contracts.status LIKE :searchParam', { searchParam })
            .orWhere('crmCompany.fantasyName LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }
    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('contracts.contracts_company_fk = :companyId', {
        companyId,
      });
    }
    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [contracts, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;
    const paginationLinks = buildPaginationLinks({
      data: contracts,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });
    paginationLinks.items = paginationLinks.items.map((contract) => {
      return {
        ...contract,
        clientSupplier: contract.crmCompany?.socialReason,
      };
    });

    return paginationLinks;
  }

  async createContract(data: CreateContractDto) {
    const contract = this.contractsRepository.create(data);
    const contractSaved = await this.contractsRepository.save(contract);

    if (data.document) {
      const contractFile = await this.s3Service.uploadFile({
        file: Buffer.from(data.document.base, 'base64'),
        fileType: data.document.type,
        fileName: data.document.name,
        moduleId: process.env.MODULE_CRM_ID,
        companyId: data.companyId,
        id: contractSaved.id.toString(),
        path: `${data.companyId}/contracts`,
      });
      contract.link = contractFile.link;
    }

    await this.contractsRepository.save(contract);

    const savedContractWithDoc = await this.contractsRepository.findOne({
      where: { id: contractSaved.id },
      relations: ['crmCompany'],
    });

    const formattedContrat = {
      ...savedContractWithDoc,
      clientSupplier: savedContractWithDoc.crmCompany?.socialReason,
    };

    delete formattedContrat.crmCompany;
    return formattedContrat;
  }

  async deleteContract(id: number) {
    const contract = await this.contractsRepository.findOne({
      where: { id },
    });

    if (!contract) {
      throw new AppError('Contract not found', 404);
    }

    const contractFile = await this.uploadRepository.findOne({
      where: {
        module: contract.id.toString(),
        moduleId: process.env.MODULE_CRM_ID,
      },
    });

    if (contractFile.link) {
      await this.s3Service.deleteFile(contractFile.path);
      await this.uploadRepository.remove(contractFile);
    }

    const contractDeleted = await this.contractsRepository.remove(contract);

    return contractDeleted;
  }

  async editContract(id: number, data: Partial<CreateContractDto>) {
    const contract = await this.contractsRepository.findOne({
      where: { id },
    });

    if (!contract) {
      throw new AppError('Contract not found', 404);
    }

    const companyId = data.companyId;
    delete data.companyId;
    delete data.link;
    delete data['id'];

    Object.assign(contract, data);
    const contractEdited = await this.contractsRepository.save(contract);

    if (data.document) {
      const contractFile = await this.uploadRepository.findOne({
        where: {
          module: contract.id.toString(),
          moduleId: process.env.MODULE_CRM_ID,
        },
      });
      await this.s3Service.deleteFile(contractFile.path);
      await this.uploadRepository.remove(contractFile);

      const contractFileEdited = await this.s3Service.uploadFile({
        file: Buffer.from(data.document.base, 'base64'),
        fileType: data.document.type,
        fileName: data.document.name,
        moduleId: process.env.MODULE_CRM_ID,
        companyId: companyId,
        id: contractEdited.id.toString(),
        path: `${companyId}/contracts`,
      });

      contractEdited.link = contractFileEdited.link;
    }
    await this.contractsRepository.save(contractEdited);

    const savedContractWithDoc = await this.contractsRepository.findOne({
      where: { id: contractEdited.id },
      relations: ['crmCompany'],
    });

    const formattedContrat = {
      ...savedContractWithDoc,
      clientSupplier: savedContractWithDoc.crmCompany?.socialReason,
    };

    delete formattedContrat.crmCompany;
    return formattedContrat;
  }

  async getContractsStatus(companyId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const companyFilter = userAccessRule.isAdmin ? {} : { companyId };

    const activeContracts = await this.contractsRepository.find({
      where: { ...companyFilter, status: 'Ativo' },
    });

    const unactiveContracts = await this.contractsRepository.find({
      where: { ...companyFilter, status: 'Inativo' },
    });

    const cancelledContracts = await this.contractsRepository.find({
      where: { ...companyFilter, status: 'Cancelado' },
    });

    return {
      active: activeContracts.length,
      unactive: unactiveContracts.length,
      cancelled: cancelledContracts.length,
    };
  }
}
