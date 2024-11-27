import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { eventDescriptions } from 'src/constants/events/audit-descriptions.events';
import { AuditService } from 'src/modules/audit/services/audit.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}
  private readonly DONT_SAVE = 'DONT_SAVE';

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    let responseBody: any;

    const originalSend = response.send;
    response.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    const request = context.switchToHttp().getRequest();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const event = request.headers['x-audit-event'];
    const eventDescription = eventDescriptions[event];

    if (event === this.DONT_SAVE || !event) return next.handle();

    return next.handle().pipe(
      tap(() => {
        response.on('finish', async () => {
          const statusCode = response.statusCode;

          if (statusCode === 200 || 201) {
            await this.auditService.store({
              class: className,
              method: methodName,
              key: request.params?.id,
              userId: request.user?.id,
              companyId: request.user.companyId,
              description: eventDescription,
              complement: response.getHeaders()['x-audit-event-complement'],
            });
          }
        });
      }),
    );
  }
}
