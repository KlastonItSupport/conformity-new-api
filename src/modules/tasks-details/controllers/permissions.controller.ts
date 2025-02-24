import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PermissionsServices } from '../services/permissions.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks-details/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsServices) {}

  @Get('/:taskId')
  @UseGuards(AuthGuard)
  async getPermissions(@Req() req, @Param('taskId') taskId: number) {
    return await this.permissionsService.getPermissions(req.user.id, taskId);
  }
}
