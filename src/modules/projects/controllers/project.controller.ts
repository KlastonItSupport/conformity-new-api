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
import { ProjectService } from '../services/project.service';
import { CreateProjectPayloadDto } from '../dtos/create-project-payload.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getProjects(@Req() req, @Query() query) {
    return await this.projectService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      {
        clientSupplier: query.clientSupplier,
        status: query.status,
      },
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProject(@Body() data: CreateProjectPayloadDto) {
    return await this.projectService.create(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProject(@Param('id') id: string) {
    return await this.projectService.delete(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editProject(
    @Param('id') id: string,
    @Body() data: Partial<CreateProjectPayloadDto>,
  ) {
    return await this.projectService.edit(id, data);
  }

  @Get('status')
  @UseGuards(AuthGuard)
  async getProjectsByStatus(@Req() req) {
    return await this.projectService.getProjectsByStatus(
      req.user.companyId,
      req.user.id,
    );
  }
}
