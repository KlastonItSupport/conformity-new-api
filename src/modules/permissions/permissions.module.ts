import { Module } from '@nestjs/common';
import { Modules } from './entities/modules.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesServices } from './services/modules.service';
import { Permissions } from './entities/permissions.entity';
import { PermissionsServices } from './services/permissions.service';
import { Groups } from './entities/groups.entity';
import { GroupModulePermission } from './entities/group_module_permissions.entity';
import { GroupModulePermissionServices } from './services/group_module_permission.service';
import { Permissionstroller } from './controllers/permissions.controller';
import { User } from '../users/entities/users.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Modules,
      Permissions,
      Groups,
      GroupModulePermission,
      User,
      Company,
    ]),
  ],
  providers: [
    ModulesServices,
    PermissionsServices,
    Groups,
    GroupModulePermissionServices,
  ],
  controllers: [Permissionstroller],
  exports: [
    ModulesServices,
    PermissionsServices,
    GroupModulePermissionServices,
    PermissionsServices,
  ],
})
export class PermissionsModule {}
