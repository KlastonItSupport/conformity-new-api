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
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectPayloadDto } from '../dtos/create-project-payload.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
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
  async createProject(@Body() data: CreateProjectPayloadDto) {
    return await this.projectService.create(data);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectService.delete(id);
  }

  @Patch(':id')
  async editProject(
    @Param('id') id: string,
    @Body() data: Partial<CreateProjectPayloadDto>,
  ) {
    return await this.projectService.edit(id, data);
  }
}