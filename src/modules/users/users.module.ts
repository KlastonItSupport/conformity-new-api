import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersServices } from './services/users.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '3600' },
    }),
  ],
  providers: [UsersServices],
  controllers: [UsersController],
})
export class UsersModule {}
