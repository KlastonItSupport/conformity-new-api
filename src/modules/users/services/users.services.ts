import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/app-error';
import {
  ChangePasswordDto,
  CreateUserDto,
  SignInDto,
  SignInResponse,
} from '../dtos/dtos';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Groups } from 'src/modules/permissions/entities/groups.entity';
import { PermissionsServices } from 'src/modules/permissions/services/permissions.service';
import { AllPermissionsDto } from 'src/modules/permissions/dtos/create-permission-by-group';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Groups)
    private readonly grouRepository: Repository<Groups>,
    private readonly jwtService: JwtService,

    private readonly permissionsService: PermissionsServices,
  ) {}

  async isSuperUser(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (user.accessRule != 'super-user' && user.accessRule != 'super-admin') {
      throw new AppError('This Access rule is not allowed to create user', 401);
    }
  }

  async createUser(userData: CreateUserDto, userId: string): Promise<any> {
    await this.isSuperUser(userId);

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

    const company = await this.companyRepository.findOne({
      where: { id: user.companyId },
    });

    const savedUser = await this.usersRepository.save(user);
    if (userData.groupId) {
      const group = await this.grouRepository.findOne({
        where: { id: userData.groupId },
      });

      this.permissionsService.createAllPermissionsToUser(
        { userId: savedUser.id, ...group.permissions } as AllPermissionsDto,
        group.id,
      );
    }
    return { ...user, companyName: company.name };
  }

  async editUser(userData, userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    delete userData.passwordHash;
    delete userData.groupId;
    delete userData.companyId;
    if (userData.accessRule == 'super-admin') {
      delete userData.accessRule;
    }

    Object.assign(user, userData);
    const updatedUser = await this.usersRepository.save(user);

    const company = await this.companyRepository.findOne({
      where: { id: user.companyId },
    });
    return { ...updatedUser, companyName: company.name };
  }

  async signIn(signInData: SignInDto): Promise<SignInResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: signInData.email },
    });

    if (!user) {
      throw new AppError('An user with this email dont exist', 404);
    }
    const passwordMatchesHash = await bcrypt.compare(
      signInData.password,
      user.passwordHash,
    );

    if (!passwordMatchesHash) {
      throw new AppError('Password incorrect', 400);
    }

    this.usersRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync(
        {
          ...signInData,
          id: user.id,
          companyId: user.companyId,
        },
        {
          expiresIn: process.env.JWT_EXPIRES_SECRET_TOKEN,
          secret: process.env.JWT_SECRET_TOKEN,
        },
      ),
      id: user.id,
      email: user.email,
      name: user.name,
      accessRule: user.accessRule,
      companyId: user.companyId,
    };
  }

  async getUsers(companyId: string) {
    const users = await this.usersRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });

    await Promise.all(
      users.map(async (user) => {
        const company = await this.companyRepository.findOne({
          where: { id: user.companyId },
        });
        user.companyName = company.name;
      }),
    );
    return users;
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!user) {
      throw new AppError('An user with this email dont exist', 404);
    }
    try {
      this.jwtService.verify(data.token, {
        secret: process.env.JWT_SECRET_TOKEN,
      });

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      user.passwordHash = hashedPassword;
      await this.usersRepository.save(user);

      return { status: 200, message: 'Password changed successfully' };
    } catch (_) {
      throw new AppError('Token invalid or expired', 404);
    }
  }

  async deleteUsers(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return await this.usersRepository.remove(user);
  }
}
