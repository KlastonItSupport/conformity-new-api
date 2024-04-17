import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersServices } from '../services/users.services';
import {
  ChangePasswordDto,
  CreateUserDto,
  SignInDto,
  SignInResponse,
} from '../dtos/dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from '../entities/users.entity';

@Controller('users')
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

  @Patch(':id')
  async editUser(@Body() userData, @Param('id') userId: string): Promise<any> {
    return this.usersService.editUser(userData, userId);
  }
  @Post('/change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() data: ChangePasswordDto) {
    return this.usersService.changePassword(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Req() req): Promise<User[]> {
    return await this.usersService.getUsers(req.user.companyId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param() param) {
    return await this.usersService.deleteUsers(param.id);
  }
}
