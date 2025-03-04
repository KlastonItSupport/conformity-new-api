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
import { UserToken } from '../entities/user-token.entity';
import { MailerService } from 'src/modules/mailer/services/mailer.service';
import { randomUUID } from 'crypto';
import { ResetPasswordDTO } from '../dtos/reset-password-dto';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Groups)
    private readonly grouRepository: Repository<Groups>,
    private readonly jwtService: JwtService,

    private readonly permissionsService: PermissionsServices,
    private readonly s3Service: S3Service,
    private readonly mailTemplateService: TemplateService,
    private readonly mailerService: MailerService,
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
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (userData.fileName && userData.profilePic) {
      const profilePicUrl = await this.s3Service.uploadFile({
        file: Buffer.from(userData.profilePic, 'base64'),
        path: `${user.companyId}/users`,
        fileType: userData.fileType,
        fileName: userData.fileName,
        companyId: user.companyId,
        moduleId: process.env.MODULE_DOCUMENTS_ID,
        id: user.id,
      });
      userData.profilePic = profilePicUrl.link;
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
    console.log('BBBBB');
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
      companyName: company?.name,
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

  async forgotPassword(email: string) {
    const SALT = 10;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new AppError('User not found', 404);
    const token = randomUUID();
    const tokenHash = await bcrypt.hash(token, SALT);
    const userToken = new UserToken();
    userToken.userId = user.id;
    userToken.tokenHash = tokenHash;
    await this.mailerService.sendEmail({
      to: user.email,
      subject: 'Recuperação de senha',
      html: `
        <p>Olá ${user.name},</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}&email=${email}">Redefinir senha</a></p>
        <p>Se você não solicitou uma redefinição de senha, ignore este e-mail.</p>
        <p>Atenciosamente,</p>
        <p>Equipe Conformity</p>
      `,
    });
    await this.userTokenRepository.save(userToken);
  }

  async resetPassword({ email, newPassword, token }: ResetPasswordDTO) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new AppError('User not found', 404);
    const userToken = await this.userTokenRepository.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
    if (!userToken) throw new AppError('Forbidden Access', 403);
    const tokenMatches = await bcrypt.compare(token, userToken.tokenHash);
    if (!tokenMatches) throw new AppError('Invalid token', 401);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await this.usersRepository.save(user);
  }
}
