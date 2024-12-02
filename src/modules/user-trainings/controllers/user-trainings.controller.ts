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
  Response,
  UseGuards,
} from '@nestjs/common';
import { UserTrainingsService } from '../services/user-trainings.service';
import { CreateTrainingUserDto } from '../dtos/create-user-training.dto';
import { UpdateUserTraining } from '../dtos/update-user-training.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { Response as Res } from 'express';
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
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateTrainingUserDto, @Response() res: Res) {
    const created = await this.userTrainingService.create(data);

    return res
      .set({
        'x-audit-event-complement': `${created.trainingId}(${created?.trainingName})`,
      })
      .send(created);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() data: UpdateUserTraining,
    @Response() res: Res,
  ) {
    const updated = await this.userTrainingService.update(id, data);

    return res
      .set({
        'x-audit-event-complement': `${updated.trainingId}(${updated?.trainingName})`,
      })
      .send(updated);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.userTrainingService.delete(id);
    return res
      .set({
        'x-audit-event-complement': `${deleted.trainingId}(${deleted?.trainingName})`,
      })
      .send(deleted);
  }

  @UseGuards(AuthGuard)
  @Post('certificates/:id')
  async createCertificates(
    @Body() data: ConvertedFile[],
    @Param('id') id: number,
    @Req() req,
    @Response() res: Res,
  ) {
    const uploadsCertificates =
      await this.userTrainingService.uploadCertificates(
        data,
        id,
        req.user.companyId,
      );

    return res
      .set({ 'x-audit-event-complement': `#${id}` })
      .json(uploadsCertificates);
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
  @UseGuards(AuthGuard)
  async deleteCertificates(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.userTrainingService.deleteCertificate(id);
    return res
      .set({ 'x-audit-event-complement': deleted.module })
      .json(deleted);
  }

  @Get('certificates-details/:id')
  async getCertificatesDetails(@Param('id') id: number) {
    return await this.userTrainingService.getCertificatesDetails(id);
  }
}
