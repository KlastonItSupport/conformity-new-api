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
  UseInterceptors,
} from '@nestjs/common';
import { UsersServices } from '../services/users.services';
import {
  ChangePasswordDto,
  CreateUserDto,
  PaginationUsersDto,
  SignInDto,
  SignInResponse,
} from '../dtos/dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuditInterceptor } from 'src/guards/interceptors/audit.interceptor';

@Controller('users')
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUser(@Body() data: CreateUserDto, @Req() req): Promise<any> {
    return this.usersService.createUser(data, req.user.id);
  }

  @Post('/signIn')
  async signIn(@Body() data: SignInDto): Promise<SignInResponse> {
    return await this.usersService.signIn(data);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async editUser(@Body() userData, @Param('id') userId: string): Promise<any> {
    return this.usersService.editUser(userData, userId);
  }
  @Post('/change-password')
  // @UseGuards(AuthGuard)
  async changePassword(@Body() data: ChangePasswordDto) {
    return this.usersService.changePassword(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Req() req, @Query() data): Promise<PaginationUsersDto> {
    return await this.usersService.getUsers(
      req.user.companyId,
      data.page,
      data.pageSize,
      data.search,
      req.user.id,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param() param) {
    return await this.usersService.deleteUsers(param.id);
  }

  @Get('access-rule/:id')
  // @UseGuards(AuthGuard)
  async getUserAccessRule(@Param() param) {
    return await this.usersService.getUserAccessRule(param.id);
  }
}
