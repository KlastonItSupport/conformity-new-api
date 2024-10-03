import { Module } from '@nestjs/common';
import { CnpjInfoController } from './controllers/cnpj-info.controller';
import { CnpjInfoService } from './services/cnpj-info.service';

@Module({
  controllers: [CnpjInfoController],
  providers: [CnpjInfoService],
})
export class CnpjInfoModule {}
