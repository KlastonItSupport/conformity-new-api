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
import { RolesService } from '../services/roles.services';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() data: CreateRoleDto) {
    return this.rolesService.createCategory(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req, @Query() query) {
    return this.rolesService.findAll(req.user.companyId, {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
      search: query.search ?? '',
    });
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.rolesService.delete(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data) {
    return this.rolesService.update(id, data.name);
  }
}
