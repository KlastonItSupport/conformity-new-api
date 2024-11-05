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
import { UserTrainingsService } from '../services/user-trainings.service';
import { CreateTrainingUserDto } from '../dtos/create-user-training.dto';
import { UpdateUserTraining } from '../dtos/update-user-training.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';

@Controller('user-trainings')
export class UserTrainingsController {
  constructor(private readonly userTrainingService: UserTrainingsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Query() query, @Req() req) {
    return await this.userTrainingService.get(
      {
        page: query.page ?? 1,
        pageSize: 10,
        search: query.search ?? '',
      },
      req.user.id,
    );
  }

  @Post()
  async create(@Body() data: CreateTrainingUserDto) {
    return this.userTrainingService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateUserTraining) {
    return this.userTrainingService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userTrainingService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Post('certificates/:id')
  async createCertificates(
    @Body() data: ConvertedFile[],
    @Param('id') id: number,
    @Req() req,
  ) {
    return await this.userTrainingService.uploadCertificates(
      data,
      id,
      req.user.companyId,
    );
  }

  @Get('certificates/:id')
  async getCertificates(@Param('id') id: number, @Query() query) {
    return await this.userTrainingService.getCertificates(id, {
      page: query.page ?? 1,
      pageSize: 10,
      search: query.search ?? '',
    });
  }

  @Delete('certificates/:id')
  async deleteCertificates(@Param('id') id: number) {
    return await this.userTrainingService.deleteCertificate(id);
  }

  @Get('certificates-details/:id')
  async getCertificatesDetails(@Param('id') id: number) {
    return await this.userTrainingService.getCertificatesDetails(id);
  }
}
