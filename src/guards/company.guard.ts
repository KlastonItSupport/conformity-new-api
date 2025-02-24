// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigsService } from 'src/modules/companies/services/configs.services';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) {
      return false;
    }

    const config = await this.configService.getToken(token);
    if (!config) {
      return false;
    }

    try {
      // const decoded = this.jwtService.verify(token.replace('Bearer ', ''));
      // return decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
