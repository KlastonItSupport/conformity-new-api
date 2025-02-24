// error-logging.middleware.ts
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { ErrorLogService } from './error-logs.service';

@Injectable()
export class ErrorLoggingMiddleware implements NestMiddleware {
  constructor(private readonly errorLogService: ErrorLogService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.on('close', async () => {
      const { query, body, method, route } = req;
      const headers = JSON.parse(JSON.stringify(req.headers));

      await this.errorLogService.createErrorLog({
        headers: JSON.stringify(headers),
        body: JSON.stringify(method === 'GET' && query ? null : body),
        route: JSON.stringify(route),
      });
    });
    next();
  }

  private handleError(
    error: any,
    route: string,
  ): { status: number; message: string; route?: string } {
    if (error instanceof HttpException) {
      return {
        status: error.getStatus(),
        message: error.message,
        route: route,
      };
    } else {
      return { status: 500, message: 'Internal Server Error', route: route };
    }
  }
}
