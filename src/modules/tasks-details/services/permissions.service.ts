import { Injectable } from '@nestjs/common';
import { UsersServices } from 'src/modules/users/services/users.services';
import { EvaluatorService } from './evaluators.services';

@Injectable()
export class PermissionsServices {
  constructor(
    private readonly usersService: UsersServices,
    private readonly evaluatorService: EvaluatorService,
  ) {}

  async getPermissions(userId: string, taskId: number) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    if (userAccessRule.isAdmin || userAccessRule.isSuperUser) {
      return {
        isAllowed: true,
      };
    }

    const evaluators = await this.evaluatorService.getEvaluator(taskId);
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
