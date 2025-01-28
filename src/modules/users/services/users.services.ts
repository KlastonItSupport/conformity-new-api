import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/app-error';
import {
  ChangePasswordDto,
  CreateUserDto,
  PaginationUsersDto,
  SignInDto,
  SignInResponse,
} from '../dtos/dtos';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Groups } from 'src/modules/permissions/entities/groups.entity';
import { PermissionsServices } from 'src/modules/permissions/services/permissions.service';
import { AllPermissionsDto } from 'src/modules/permissions/dtos/create-permission-by-group';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { TemplateService } from 'src/modules/mailer/services/template.service';

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
    private readonly s3Service: S3Service,
    private readonly mailTemplateService: TemplateService,
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
    const user = await this.usersRepository.create({
      ...userData,
      departament: userData.departament,
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

    await this.mailTemplateService.setUpTemplate(
      'boas-vindas',
      {
        usuario: { nome: user.name },
        empresa: { nome: company.name },
      },
      user.email,
    );

    return { ...user, companyName: company.name };
  }

  async editUser(userData, userId: string): Promise<any> {
    console.log('Backend received:', { userData, userId });
  
    const userToEdit = await this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['company'] // Aseguramos cargar la relación
    });
    console.log('Found user:', userToEdit);
  
    if (!userToEdit) {
      throw new AppError('User not found', 404);
    }
  
    // Verificación para cambio de compañía
    if (userData.companyId && userData.companyId !== userToEdit.companyId) {
      console.log('Company change requested:', {
        current: userToEdit.companyId,
        new: userData.companyId
      });
  
      const accessRule = await this.getUserAccessRule(userId);
      if (!accessRule.isAdmin) {
        throw new AppError('Only super-admin can change company', 403);
      }
      
      const company = await this.companyRepository.findOne({
        where: { id: userData.companyId }
      });
      
      if (!company) {
        throw new AppError('Company not found', 404);
      }
  
      await this.permissionsService.getUserPermissions(userId);
    }
  
    // Manejo de la foto de perfil
    if (userData.fileName && userData.profilePic) {
      const profilePicUrl = await this.s3Service.uploadFile({
        file: Buffer.from(userData.profilePic, 'base64'),
        path: `${userToEdit.companyId}/users`,
        fileType: userData.fileType,
        fileName: userData.fileName,
        companyId: userToEdit.companyId,
        moduleId: process.env.MODULE_DOCUMENTS_ID,
        id: userToEdit.id,
      });
      userData.profilePic = profilePicUrl.link;
    }
  
    // Limpieza de datos sensibles o restringidos
    delete userData.passwordHash;
    delete userData.groupId;
    
    // Protección especial para el rol super-admin
    if (userData.accessRule === 'super-admin') {
      delete userData.accessRule;
    }
  
    console.log('User before update:', userToEdit);
    Object.assign(userToEdit, userData);
    console.log('User after update:', userToEdit);
  
    const updatedUser = await this.usersRepository.save(userToEdit);
    console.log('Saved user:', updatedUser);
  
    // Obtener información actualizada de la compañía
    const company = await this.companyRepository.findOne({
      where: { id: updatedUser.companyId },
    });
  
    // Notificación por correo si hubo cambio de compañía
    if (userData.companyId && userData.companyId !== userToEdit.companyId) {
      try {
        await this.mailTemplateService.setUpTemplate(
          'company-change',
          {
            usuario: { nome: updatedUser.name },
            empresa: { nome: company.name },
          },
          updatedUser.email
        );
      } catch (error) {
        console.error('Failed to send company change notification:', error);
      }
    }
  
    const result = { ...updatedUser, companyName: company.name };
    console.log('Final response:', result);
    
    return result;
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

    const company = await this.companyRepository.findOne({
      where: { id: user.companyId },
    });

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
      celphone: user.celphone,
      profilePic: user.profilePic,
      birthDate: user.birthday,
      companyId: user.companyId,
      companyName: company.name,
    };
  }
  async getUsers(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
    userId: string,
  ): Promise<any> {
    const accessRule = await this.getUserAccessRule(userId);

    if (!accessRule.isAdmin && !accessRule.isSuperUser) {
      throw new AppError('Not Authorized', 401);
    }
    const pagination = new PaginationUsersDto();

    const searchParam = {
      searchName: `%${search}%`,
    };

    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    if (accessRule.isSuperUser) {
      queryBuilder.where('users.company_id_fk = :companyId', { companyId });
    }

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('users.name LIKE :searchName', searchParam)
            .orWhere('users.email LIKE :searchName', searchParam)
            .orWhere('users.status LIKE :searchName', searchParam)
            .orWhere('users.access_rule LIKE :searchName', searchParam);
        }),
      );
    }

    if (page && limit) {
      queryBuilder.offset((page - 1) * limit).limit(limit);
    }

    const users = await queryBuilder.getManyAndCount();

    const totalUsers = users[1];
    const lastPage = limit ? Math.ceil(totalUsers / limit) : 1;

    const links = {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: limit ? Math.ceil(totalUsers / limit) : 1,
      currentPage: limit ? page : 1,
      previous: limit ? (page > 1 ? page - 1 : 0) : null,
      totalItems: totalUsers,
    };

    pagination.items = users[0];
    pagination.pages = links;

    await Promise.all(
      pagination.items.map(async (user) => {
        const company = await this.companyRepository.findOne({
          where: { id: user.companyId },
        });
        user.companyName = company.name;
      }),
    );

    return pagination;
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

      return {
        status: 200,
        message: 'Password changed successfully',
        id: user.id,
        name: user.name,
      };
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

  async getUserAccessRule(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const accessLevels = {
      isAdmin: user.accessRule === 'super-admin',
      isSuperUser: user.accessRule === 'super-user',
      isUser: user.accessRule === 'user',
    };

    return accessLevels;
  }
}
