import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { eventDescriptions } from 'src/constants/events/audit-descriptions.events';
import { AuditService } from 'src/modules/audit/services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  private readonly DONT_SAVE = 'DONT_SAVE';
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const event = request.headers['x-audit-event'];
    const eventDescription = eventDescriptions[event];

    if (event === this.DONT_SAVE || !event) return next.handle();

    return next.handle().pipe(
      tap(async () => {
        await this.auditService.store({
          class: className,
          method: methodName,
          key: request.params?.id,
          userId: request.user.id,
          companyId: request.user.companyId,
          description: eventDescription,
        });
      }),
    );
  }
}
