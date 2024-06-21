import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DepartamentPermissionsService } from '../services/departament-permissions.services';
import { CreateDepartamentPermissionPayload } from '../dtos/create-departament-permission-payload';

@Controller('departaments-permissions')
export class DepartamentsPermissionsController {
  constructor(
    private readonly departamentPermissionsService: DepartamentPermissionsService,
  ) {}

  @Post('')
  createDepartamentPermissions(
    @Body() data: CreateDepartamentPermissionPayload,
  ) {
    return this.departamentPermissionsService.createDepartamentPermission(data);
  }

  @Get(':id')
  getDepartamentPermission(@Param('id') id: string) {
    return this.departamentPermissionsService.getDepartamentPermission(id);
  }

  @Delete(':id')
  deleteDepartamentPermission(@Param('id') id: number) {
    return this.departamentPermissionsService.deleteDepartamentPermission(id);
  }
}
