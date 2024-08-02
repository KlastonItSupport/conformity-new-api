import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IshikawaServices } from '../services/ishikawa.services';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks-details/ishikawa')
export class IshikawaController {
  constructor(private readonly ishikawaService: IshikawaServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createIshikawa(@Body() data: any, @Req() req) {
    return this.ishikawaService.createIshikawa({
      ...data,
      userId: req.user.id,
    });
  }

  @Get(':id')
  async getIshikawa(@Param('id') id: number) {
    return this.ishikawaService.getIshikawa(id);
  }

  @Delete(':id')
  async deleteIshikawa(@Param('id') id: number) {
    return this.ishikawaService.deleteIshikawa(id);
  }

  @Patch(':id')
  async updateIshikawa(@Param('id') id: number, @Body() data: any) {
    return this.ishikawaService.updateIshikawa(id, data);
  }
}
