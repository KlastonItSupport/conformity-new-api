import { Body, Controller, Post } from '@nestjs/common';
import { SupportService } from '../services/support.service';
import { CreateSupportCase } from '../dtos/create-support-case.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  async sendSupportMail(@Body() data: CreateSupportCase) {
    return await this.supportService.sendSupportEmail(data);
  }
}
