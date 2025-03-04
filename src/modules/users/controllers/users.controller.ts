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
  Response,
  UseGuards,
  HttpException,
  HttpStatus,
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
import { Response as Res } from 'express';
import { ForgotPasswordDTO } from '../dtos/forgot-password-dto';
import { AppError } from 'src/errors/app-error';
import { ResetPasswordDTO } from '../dtos/reset-password-dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUser(@Body() data: CreateUserDto, @Req() req): Promise<any> {
    return this.usersService.createUser(data, req.user.id);
  }

  @Post('/signin')
  async signIn(@Body() data: SignInDto): Promise<SignInResponse> {
    console.log('Endpoint /signin reached');
    console.log('Request data:', data);

    try {
      const result = await this.usersService.signIn(data);
      console.log('SignIn successful for user:', data.email);
      return result;
    } catch (error) {
      console.error('Error in signIn:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Authentication failed',
          message: error.response?.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async editUser(@Body() userData, @Param('id') userId: string): Promise<any> {
    return await this.usersService.editUser(userData, userId);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() data: ChangePasswordDto, @Response() res: Res) {
    const user = await this.usersService.changePassword(data);
    return res
      .set({ 'x-audit-event-complement': `${user.id} (${user.name})` })
      .json(user);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDTO) {
    if (!data.email) throw new AppError('Email is required', 400);
    return await this.usersService.forgotPassword(data.email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() data: ResetPasswordDTO) {
    if (!data.email) throw new AppError('Email is required', 400);
    if (!data.newPassword) throw new AppError('New password is required', 400);
    if (!data.token) throw new AppError('Token is required', 400);
    return await this.usersService.resetPassword(data);
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
