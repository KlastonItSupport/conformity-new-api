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
import { MailerService } from 'src/modules/mailer/services/mailer.service';
import { CryptoService } from '../../../helpers/crypto';
import { AppError } from '../../../helpers/error';

@Controller('userss')
export class UsersController {
  constructor(
    private readonly usersService: UsersServices,
    private readonly mailerService: MailerService,
  ) {}

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

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate reset token
    const resetToken = CryptoService.generateRandomToken(32);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // Send email
    await this.mailerService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name,
    );

    return { message: 'Password reset email sent' };
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ) {
    const user = await this.usersService.findByResetToken(token);

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new AppError('Invalid or expired token', 400);
    }

    const hashedPassword = await CryptoService.hashPassword(newPassword);
    await this.usersService.update(user.id, {
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Password has been reset successfully' };
  }
}
