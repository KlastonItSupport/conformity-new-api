import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WarningsService } from '../services/warnings.service';
import { CreateWarningDto } from '../dtos/create-warning.dto';
import { ReadWarningDto } from '../dtos/read-warning.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('warnings')
export class WarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createWarning(@Body() data: CreateWarningDto) {
    return await this.warningsService.createWarning(data);
  }

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getUserWarnings(@Param('userId') userId: string, @Req() req) {
    return await this.warningsService.getUserWarnings(
      userId,
      req.user.companyId,
    );
  }

  @Post('read-warning')
  async readWarning(@Body() data: ReadWarningDto) {
    return await this.warningsService.readWarning(data);
  }

  @UseGuards(AuthGuard)
  @Get('/get-company-warnings/:companyId')
  async getCompanyWarnings(@Param('companyId') companyId: string) {
    return await this.warningsService.getCompanyWarnings(companyId);
  }
}
