import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from '../entities/permissions.entity';
import {
  CreatePermissionByGroupDto,
  CreatePermissionDto,
  AllPermissionsDto,
  CreateGroupPermissionModule,
  EditPermissionByGroupDto,
  PaginationGroupsDto,
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
      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '1',
          ...allPermissions.documents,
        },
        groupId,
      ),
      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '2',
          ...allPermissions.tasks,
        },
        groupId,
      ),

      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '3',
          ...allPermissions.equipments,
        },
        groupId,
      ),

      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '4',
          ...allPermissions.indicators,
        },
        groupId,
      ),

      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '5',
          ...allPermissions.crm,
        },
        groupId,
      ),

      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '6',
          ...allPermissions.training,
        },
        groupId,
      ),

      this.giveOneUserPermission(
        {
          userId: allPermissions.userId,
          moduleId: '7',
          ...allPermissions.companies,
        },
        groupId,
      ),
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

  async giveOneUserPermission(
    data: CreatePermissionDto,
    groupId: string,
  ): Promise<Permissions> {
    const permission = await this.permissionsRepository.create(data);
    const permissionSaved = await this.permissionsRepository.save(permission);

    const groupModulePermission = this.groupModulePermissionRepository.create({
      groupId: groupId,
      permissionsId: permission.id,
    });
    await this.groupModulePermissionRepository.save(groupModulePermission);

    return permissionSaved;
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

    const documentsModule: Permissions[] = [];
    const tasksModule: Permissions[] = [];
    const equipmentsModule: Permissions[] = [];
    const indicatorsModule: Permissions[] = [];
    const crmModule: Permissions[] = [];
    const trainingModule: Permissions[] = [];
    const companiesModule: Permissions[] = [];

    usersPermissions.forEach((permission) => {
      if (permission.moduleId == '1') {
        documentsModule.push(permission);
        return;
      }

      if (permission.moduleId == '2') {
        tasksModule.push(permission);
        return;
      }

      if (permission.moduleId == '3') {
        equipmentsModule.push(permission);
        return;
      }

      if (permission.moduleId == '4') {
        indicatorsModule.push(permission);
        return;
      }

      if (permission.moduleId == '5') {
        crmModule.push(permission);
        return;
      }

      if (permission.moduleId == '6') {
        trainingModule.push(permission);
        return;
      }

      if (permission.moduleId == '7') {
        companiesModule.push(permission);
        return;
      }
    });

    return {
      documents: this.resumingPermissions(documentsModule),
      tasks: this.resumingPermissions(tasksModule),
      equipments: this.resumingPermissions(equipmentsModule),
      indicators: this.resumingPermissions(indicatorsModule),
      crm: this.resumingPermissions(crmModule),
      training: this.resumingPermissions(trainingModule),
      companies: this.resumingPermissions(companiesModule),
    };
  }

  async getModulePermissions(moduleId: string, userId: string) {
    const usersPermissions = await this.permissionsRepository.find({
      where: { userId, moduleId: moduleId },
    });
    return this.resumingPermissions(usersPermissions);
  }

  // Procura por todas as permissoes de um modulo e "soma" elas
  resumingPermissions(permissions: Permissions[]): Permissions {
    const permissionResumed = {
      canAdd: 0,
      canDelete: 0,
      canEdit: 0,
      canRead: 0,
    } as Permissions;
    permissions.forEach((module) => {
      if (!permissionResumed.canAdd && module.canAdd) {
        permissionResumed.canAdd = 1;
      }

      if (!permissionResumed.canDelete && module.canDelete) {
        permissionResumed.canDelete = 1;
      }
      if (!permissionResumed.canEdit && module.canEdit) {
        permissionResumed.canEdit = 1;
      }
      if (!permissionResumed.canRead && module.canRead) {
        permissionResumed.canRead = 1;
      }
    });
    return permissionResumed;
  }

  async getGroupsPaginated(
    queryBuilder: SelectQueryBuilder<Groups>,
    page: number,
    limit: number,
  ) {
    const groups = await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();

    const totalGroups = groups[1];
    const lastPage = limit ? Math.ceil(totalGroups / limit) : 1;
    const links = {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: limit ? Math.ceil(totalGroups / limit) : 1,
      currentPage: Number(limit ? page : 1),
      previous: limit ? (page > 1 ? page - 1 : 0) : null,
      totalItems: totalGroups,
    };

    const pagination = new PaginationGroupsDto();
    pagination.items = groups[0];
    pagination.pages = links;

    return pagination;
  }

  async getGroupsByCompany(
    companyId: string,
    userId: string,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const isSuperAdmin = await this.isSuperAdmin(userId);
    const queryBuilder = this.groupsRepository.createQueryBuilder('groups');

    if (isSuperAdmin) {
      queryBuilder.where('groups.fk_company_id = :companyId', {
        companyId: companyId,
      });
    }

    if (search) {
      queryBuilder.andWhere('groups.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const groupsPaginated = await this.getGroupsPaginated(
      queryBuilder,
      page,
      Number(limit),
    );
    const formattedGroup = await groupsPaginated.items.map((group) => {
      const formattedGroup = { ...group, ...group.permissions };
      delete formattedGroup.permissions;
      return formattedGroup;
    });

    groupsPaginated.items = formattedGroup;
    return groupsPaginated;
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

  async editGroupPermission(groupId: string, data: EditPermissionByGroupDto) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    if (data.name && data.name != group.name) {
      group.name = data.name;
    }

    if (data.permissions) {
      group.permissions = data.permissions;
    }

    await this.groupsRepository.save(group);

    await this.removePermissionsFromUsers(group.id);

    await Promise.all(
      data.users.map(async (userId) => {
        if (userId) {
          const user = await this.usersRepository.findOne({
            where: { id: userId },
          });

          const userBelongsToThisCompany = user?.companyId === group.companyId;

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

    return group;
  }

  async removePermissionsFromUsers(groupId: string) {
    const permissionFromThisGroup =
      await this.groupModulePermissionRepository.find({ where: { groupId } });

    await Promise.all(
      permissionFromThisGroup.map(async (permission) => {
        const permissionOnDb = await this.permissionsRepository.findOne({
          where: { id: permission.permissionsId },
        });

        if (permissionOnDb) {
          await this.permissionsRepository.remove(permissionOnDb);
        }
      }),
    );

    await this.groupModulePermissionRepository.remove(permissionFromThisGroup);
  }

  async getUsersFromGroup(groupId: string) {
    const users = [];
    const permissionFromThisGroup =
      await this.groupModulePermissionRepository.find({ where: { groupId } });

    if (!permissionFromThisGroup) {
      throw new AppError('Group not found', 404);
    }

    await Promise.all(
      permissionFromThisGroup.map(async (permissionGroup) => {
        const permissionOnDb = await this.permissionsRepository.findOne({
          where: { id: permissionGroup.permissionsId },
        });

        if (permissionOnDb) {
          const user = await this.usersRepository.findOne({
            where: { id: permissionOnDb.userId },
          });

          if (user && !users.find((u) => u.id === user.id)) {
            users.push({
              id: user.id,
              name: user.name,
            });
          }
        }
      }),
    );

    return users;
  }
}
