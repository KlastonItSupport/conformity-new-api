import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/app-error';
import { CreateUserDto } from '../dtos/dtos';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<any> {
    const hasUserWithThisEmail = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (hasUserWithThisEmail) {
      throw new AppError('An account with this email already exists', 409);
    }

    const hasCompanyWithThisId = await this.companyRepository.findOne({
      where: { id: userData.companyId },
    });

    if (!hasCompanyWithThisId) {
      throw new AppError('An company with this id was not found', 404);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const companyId = userData.companyId;
    delete userData.password;
    delete userData.companyId;

    const user = await this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
      companyId: companyId,
    });

    await this.usersRepository.save(user);

    return user;
  }
}
