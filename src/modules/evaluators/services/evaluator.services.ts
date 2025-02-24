import { Injectable } from '@nestjs/common';
import { Evaluators } from '../entities/evaluators.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluatorCreatePayload } from '../dtos/create-evaluator-payload';
import { User } from 'src/modules/users/entities/users.entity';
import { Document } from 'src/modules/documents/entities/document.entity';
import { UsersServices } from 'src/modules/users/services/users.services';
import { EvaluatorForAnalysis } from '../dtos/evaluator-for-analysis';
import { PaginationEvaluatorDto } from '../dtos/evaluator-analysis-pagination.dto';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class EvaluatorService {
  constructor(
    @InjectRepository(Evaluators)
    private readonly evaluatorRepository: Repository<Evaluators>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    private readonly usersService: UsersServices,
  ) {}

  async createEvaluator(data: EvaluatorCreatePayload) {
    const evaluator = this.evaluatorRepository.create(data);
    const evaluatorSaved = await this.evaluatorRepository.save(evaluator);

    const user = await this.userRepository.findOne({
      where: { id: evaluator.userId },
    });

    return { ...evaluatorSaved, userName: user.name };
  }

  async getEvaluator(documentId: string) {
    const evaluators = await this.evaluatorRepository.find({
      where: { documentId },
    });

    await Promise.all(
      evaluators.map(async (evaluator) => {
        const user = await this.userRepository.findOne({
          where: { id: evaluator.userId },
        });
        evaluator.userName = user?.name;
      }),
    );
    return evaluators;
  }

  async deleteEvaluator(id: number) {
    const evaluator = await this.evaluatorRepository.findOne({
      where: { id },
    });

    return await this.evaluatorRepository.remove(evaluator);
  }

  async getUserAnalysis(
    companyId: string,
    userId: string,
    page = 1,
    limit = 5,
    search = '',
  ): Promise<any> {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const pagination = new PaginationEvaluatorDto();

    const queryBuilder = this.documentsRepository
      .createQueryBuilder('documents')
      .leftJoinAndSelect(
        'documents_approvals',
        'approvals',
        'approvals.documentId = documents.id',
      )
      .leftJoin('approvals.user', 'users')
      .where('documents.status <> :status', { status: 'inactive' })
      .andWhere('documents.companyId = :companyId', { companyId })
      .andWhere('(approvals.approved = 1 OR approvals.reviewed = 1)')
      .andWhere('(approvals.cancelled IS NULL OR approvals.cancelled = 0)')
      .orderBy('documents.createdAt', 'ASC');

    if (userAccessRule.isUser) {
      queryBuilder.andWhere('approvals.userId = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(documents.name LIKE :search OR users.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const documents = await queryBuilder.getMany();

    const approvalsPromise = documents.map(async (document) => {
      let approvals;
      if (userAccessRule.isUser) {
        approvals = await this.evaluatorRepository.find({
          where: [
            { documentId: document.id, approved: 1, reviewed: 1 },
            { documentId: document.id, approved: 0, reviewed: 1 },
          ],
          relations: ['user'],
        });
      } else if (userAccessRule.isAdmin || userAccessRule.isSuperUser) {
        approvals = await this.evaluatorRepository.find({
          where: [
            { documentId: document.id, approved: 1, reviewed: 1 },
            { documentId: document.id, approved: 0, reviewed: 1 },
            { documentId: document.id, approved: 1, reviewed: 0 },
          ],
          relations: ['user'],
        });
      }

      return approvals
        .filter((approval) => {
          const userName = approval.user.name.toLowerCase();
          const searchTerm = search.toLowerCase();
          return userName.includes(searchTerm);
        })
        .map((approval) => ({
          documentId: document.id,
          documentName: document.name,
          id: approval.id,
          approved: approval.approved,
          reviewed: approval.reviewed,
          cancelled: approval.cancelled,
          cancelDescription: approval.cancelDescription,
          userId,
          responsibleName: approval.user.name,
        }));
    });

    const res: EvaluatorForAnalysis[] = (
      await Promise.all(approvalsPromise)
    ).flat();

    const totalItems = res.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedItems = res.slice((page - 1) * limit, page * limit);

    const links = {
      first: 1,
      last: totalPages,
      next: page + 1 > totalPages ? totalPages : page + 1,
      totalPages,
      currentPage: page,
      previous: page > 1 ? page - 1 : 0,
      totalItems,
    };

    pagination.pages = links;
    pagination.items = paginatedItems;

    return pagination;
  }

  async reviewDocumentApproval(documentApprovalId: number) {
    const approval = await this.evaluatorRepository.findOne({
      where: { id: documentApprovalId },
    });

    if (approval.approved === 0) {
      throw new AppError('Not allowed to review this document', 400);
    }

    approval.reviewed = 2;
    await this.evaluatorRepository.save(approval);

    return approval;
  }

  async approveDocumentApproval(documentApprovalId: number) {
    const approval = await this.evaluatorRepository.findOne({
      where: { id: documentApprovalId },
    });

    if (approval.approved === 0) {
      throw new AppError('Not allowed to approve this document', 400);
    }

    approval.approved = 2;
    await this.evaluatorRepository.save(approval);

    return approval;
  }

  async cancelDocumentApproval(
    documentApprovalId: number,
    description: string,
  ) {
    const approval = await this.evaluatorRepository.findOne({
      where: { id: documentApprovalId },
    });

    approval.cancelled = 2;
    approval.cancelDescription = description;

    approval.reviewed = 3;
    approval.approved = 3;
    approval.edited = 3;
    approval.deleted = 3;

    await this.evaluatorRepository.save(approval);

    return approval;
  }
}
