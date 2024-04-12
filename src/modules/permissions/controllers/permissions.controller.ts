import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PermissionsServices } from '../services/permissions.service';
import { CreatePermissionByGroupDto, CreatePermissionDto } from '../dtos/dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('permissions')
export class Permissionstroller {
  constructor(private readonly permissionsServices: PermissionsServices) {}

  @Post()
  async createPermission(@Body() data: CreatePermissionDto) {
    return await this.permissionsServices.giveOneUserPermission(data);
  }

  @Post('/create-group')
  async createGroupPermission(@Body() data: CreatePermissionByGroupDto) {
    return await this.permissionsServices.createGroupPermission(data);
  }

  @Get('/get-user-permissions/:id')
  async getUserPermission(@Param() param) {
    return await this.permissionsServices.getUserPermissions(param.id);
  }

  @Get('/groups-by-company/:companyId')
  @UseGuards(AuthGuard)
  async getGroupsByCompany(@Param() param, @Req() req) {
    return await this.permissionsServices.getGroupsByCompany(
      param.companyId,
      req.user.id,
    );
  }

  @Delete('/group/:id')
  @UseGuards(AuthGuard)
  async deleteGroupById(@Param() param, @Req() req) {
    return await this.permissionsServices.deleteGroup(
      req.user.companyId,
      param.id,
    );
  }
}
