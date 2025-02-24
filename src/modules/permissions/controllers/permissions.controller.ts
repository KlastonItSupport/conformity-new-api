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
import { PermissionsServices } from '../services/permissions.service';
import {
  CreatePermissionByGroupDto,
  CreatePermissionDto,
  EditPermissionByGroupDto,
} from '../dtos/dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('permissions')
export class Permissionstroller {
  constructor(private readonly permissionsServices: PermissionsServices) {}

  @Post()
  async createPermission(@Body() data: CreatePermissionDto) {
    return await this.permissionsServices.giveOneUserPermission(data, 'teste');
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
  async getGroupsByCompany(@Param() param, @Req() req, @Query() data) {
    return await this.permissionsServices.getGroupsByCompany(
      param.companyId,
      req.user.id,
      data.page,
      data.pageSize,
      data.search,
    );
  }

  @Get('/group/users/:id')
  @UseGuards(AuthGuard)
  async getUsersFromGroup(@Param() param) {
    return await this.permissionsServices.getUsersFromGroup(param.id);
  }

  @Delete('/group/:id')
  @UseGuards(AuthGuard)
  async deleteGroupById(@Param() param, @Req() req) {
    return await this.permissionsServices.deleteGroup(
      req.user.companyId,
      param.id,
    );
  }

  @Patch('/group/:id')
  @UseGuards(AuthGuard)
  async editGroup(@Param() param, @Body() data: EditPermissionByGroupDto) {
    return this.permissionsServices.editGroupPermission(param.id, data);
  }
}
