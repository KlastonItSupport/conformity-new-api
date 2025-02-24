import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DocumentDetailsPermissionService } from '../services/permission.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('documents/permission')
export class DocumentDetailsPermissionController {
  constructor(
    private readonly documentDetailsPermissionService: DocumentDetailsPermissionService,
  ) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getPermissions(@Req() req, @Param('id') id: string) {
    return await this.documentDetailsPermissionService.getPermissions(
      req.user.id,
      id,
    );
  }
}
