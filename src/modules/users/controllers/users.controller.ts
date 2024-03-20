import { Body, Controller, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.services';
import { CreateUserDto } from '../dtos/dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersServices) {}

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<any> {
    return this.usersService.createUser(data);
  }
}
