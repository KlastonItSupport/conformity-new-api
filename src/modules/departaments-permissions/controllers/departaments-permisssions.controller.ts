import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { DepartamentPermissionsService } from '../services/departament-permissions.services';
import { CreateDepartamentPermissionPayload } from '../dtos/create-departament-permission-payload';
import { Response as Res } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('departaments-permissions')
export class DepartamentsPermissionsController {
  constructor(
    private readonly departamentPermissionsService: DepartamentPermissionsService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createDepartamentPermissions(
    @Body() data: CreateDepartamentPermissionPayload,
    @Response() res: Res,
  ) {
    const departamentAllowed =
      await this.departamentPermissionsService.createDepartamentPermission(
        data,
      );

    return res
      .set({
        'x-audit-event-complement': departamentAllowed
          .map((pa) => pa.departamentName)
          .join('|'),
      })
      .json(departamentAllowed);
  }

  @Get(':id')
  getDepartamentPermission(@Param('id') id: string) {
    return this.departamentPermissionsService.getDepartamentPermission(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteDepartamentPermission(
    @Param('id') id: number,
    @Response() res: Res,
  ) {
    const departamentAllowed =
      await this.departamentPermissionsService.deleteDepartamentPermission(id);

    return res
      .set({
        'x-audit-event-complement': `${departamentAllowed.department.name} do documento ${departamentAllowed.documentId}`,
      })
      .json(departamentAllowed);
  }
}
