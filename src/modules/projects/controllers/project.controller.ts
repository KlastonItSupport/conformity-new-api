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
  getProjects(@Req() req, @Query() query) {
    return this.projectService.getAll(
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
  createProject(@Body() data: CreateProjectPayloadDto) {
    return this.projectService.create(data);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.delete(id);
  }

  @Patch(':id')
  editProject(
    @Param('id') id: string,
    @Body() data: Partial<CreateProjectPayloadDto>,
  ) {
    return this.projectService.edit(id, data);
  }
}
