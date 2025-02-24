import { Injectable } from '@nestjs/common';
import { EvaluatorService } from 'src/modules/evaluators/services/evaluator.services';
import { UsersServices } from 'src/modules/users/services/users.services';

@Injectable()
export class DocumentDetailsPermissionService {
  constructor(
    private readonly usersService: UsersServices,
    private readonly evaluatorService: EvaluatorService,
  ) {}

  async getPermissions(userId: string, documentId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    if (userAccessRule.isAdmin || userAccessRule.isSuperUser) {
      return {
        isAllowed: true,
      };
    }

    const evaluators = await this.evaluatorService.getEvaluator(documentId);
    const userIsEvaluator = evaluators.find(
      (evaluator) => evaluator.userId === userId,
    );

    if (userIsEvaluator) {
      return {
        isAllowed: true,
      };
    }

    return {
      isAllowed: false,
    };
  }
}
