import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from '../entities/permissions.entity';
import {
  CreatePermissionByGroupDto,
  CreatePermissionDto,
  AllPermissionsDto,
  CreateGroupPermissionModule,
} from '../dtos/dto';
import { Groups } from '../entities/groups.entity';
import { GroupModulePermission } from '../entities/group_module_permissions.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { AppError } from 'src/errors/app-error';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class PermissionsServices {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,

    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,

    @InjectRepository(GroupModulePermission)
    private readonly groupModulePermissionRepository: Repository<GroupModulePermission>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async isSuperAdmin(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user.accessRule == 'super-admin';
  }

  async createAllPermissionsToUser(
    allPermissions: AllPermissionsDto,
    groupId: string,
  ) {
    const permissionsPromises = [
      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '1',
        ...allPermissions.documents,
      }),
      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '2',
        ...allPermissions.tasks,
      }),

      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '3',
        ...allPermissions.equipments,
      }),

      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '4',
        ...allPermissions.indicators,
      }),

      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '5',
        ...allPermissions.crm,
      }),

      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '6',
        ...allPermissions.training,
      }),

      this.giveOneUserPermission({
        userId: allPermissions.userId,
        moduleId: '7',
        ...allPermissions.companies,
      }),
    ];

    const responsesPermissions = await Promise.all(permissionsPromises);

    const groupModulePermissionPromises = [
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[0].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[1].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[2].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[3].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[4].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[5].id,
      }),
      this.createGroupPermissionModule({
        groupId: groupId,
        permissionsId: responsesPermissions[6].id,
      }),
    ];

    return await Promise.all(groupModulePermissionPromises);
  }

  async giveOneUserPermission(data: CreatePermissionDto): Promise<Permissions> {
    const permission = await this.permissionsRepository.create(data);
    return await this.permissionsRepository.save(permission);
  }

  async createGroupPermission(data: CreatePermissionByGroupDto) {
    const group = await this.groupsRepository.create({
      name: data.name,
      companyId: data.companyId,
      permissions: data.permissions,
    });
    await this.groupsRepository.save(group);

    await Promise.all(
      data.users.map(async (userId) => {
        if (userId) {
          const user = await this.usersRepository.findOne({
            where: { id: userId },
          });

          const userBelongsToThisCompany = user?.companyId === data.companyId;

          if (!user || !userBelongsToThisCompany) {
            return;
          }
        }

        await this.createAllPermissionsToUser(
          { ...data.permissions, userId: userId },
          group.id,
        );
      }),
    );

    await this.groupsRepository.save(group);
    return group;
  }

  async createGroupPermissionModule(data: CreateGroupPermissionModule) {
    const groupPermissionModule =
      this.groupModulePermissionRepository.create(data);

    return await this.groupModulePermissionRepository.save(
      groupPermissionModule,
    );
  }

  async getUserPermissions(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const usersPermissions = await this.permissionsRepository.find({
      where: { userId },
    });

    return usersPermissions;
  }

  async getGroupsByCompany(companyId: string, userId: string) {
    const isSuperAdmin = await this.isSuperAdmin(userId);

    if (isSuperAdmin) {
      const groups = await this.groupsRepository.find();
      const formattedGroup = groups.map((group) => {
        const formattedGroup = { ...group, ...group.permissions };
        delete formattedGroup.permissions;
        return formattedGroup;
      });

      return formattedGroup;
    }
    const groups = await this.groupsRepository.find({ where: { companyId } });

    return groups;
  }

  async deleteGroup(companyId: string, groupId: string) {
    if (!companyId || !groupId) {
      throw new AppError("You're missing one of the params", 400);
    }

    const group = await this.groupsRepository.findOne({
      where: { id: groupId, companyId },
    });

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    const groupPermissionsModule = this.groupModulePermissionRepository.find({
      where: { groupId: group.id },
    });

    await Promise.all(
      (await groupPermissionsModule).map(async (groupModule) => {
        const permission = await this.permissionsRepository.findOne({
          where: { id: groupModule.permissionsId },
        });

        if (permission) {
          await this.permissionsRepository.remove(permission);
        }
      }),
    );

    return await this.groupsRepository.remove(group);
  }
}
