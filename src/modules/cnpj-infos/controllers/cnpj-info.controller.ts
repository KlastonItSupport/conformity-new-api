import { Controller, Get, Param } from '@nestjs/common';
import { CnpjInfoService } from '../services/cnpj-info.service';

@Controller('cnpj-info')
export class CnpjInfoController {
  constructor(private readonly cnpjInfoService: CnpjInfoService) {}

  @Get(':cnpj')
  async getCnpjInfo(@Param('cnpj') cnpj: string) {
    return await this.cnpjInfoService.getCnpjInfo(cnpj);
  }
}
