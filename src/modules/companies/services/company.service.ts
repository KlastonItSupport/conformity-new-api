import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from '../dtos/dto';
import { AppError } from 'src/errors/app-error';
import { User } from 'src/modules/users/entities/users.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async isSuperAdmin(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user.accessRule != 'super-admin') {
      throw new AppError('Unauthorized', 401);
    }
  }
  async createCompany(companyPayload: CreateCompanyDto, userId: string) {
    const hasCompanyWithThisEmail = await this.companyRepository.findOne({
      where: { email: companyPayload.email },
    });

    await this.isSuperAdmin(userId);

    if (hasCompanyWithThisEmail) {
      throw new AppError('An company with this email already exists', 409);
    }

    const company = await this.companyRepository.create(companyPayload);
    return await this.companyRepository.save(company);
  }

  async getCompanies(userId: string): Promise<Company[]> {
    await this.isSuperAdmin(userId);
    return await this.companyRepository.find({ order: { createdAt: 'DESC' } });
  }
}
