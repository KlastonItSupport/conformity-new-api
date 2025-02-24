import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { CreateServicePayload } from '../dtos/create-service-payload.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Query() query, @Req() req) {
    return await this.serviceService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.companyId,
      req.user.id,
    );
  }
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateServicePayload) {
    return await this.serviceService.create(data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    return await this.serviceService.delete(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() data: Partial<CreateServicePayload>,
  ) {
    return await this.serviceService.update(data, id);
  }
}
