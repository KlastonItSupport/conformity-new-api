import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersServices } from '../services/users.services';
import { CreateUserDto, SignInDto, SignInResponse } from '../dtos/dtos';
import { AuthGuard } from 'src/guards/auth.guard';

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
}
