import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupModulePermission } from '../entities/group_module_permissions.entity';

@Injectable()
export class GroupModulePermissionServices {
  constructor(
    @InjectRepository(GroupModulePermission)
    private readonly groupModulePermissionRepository: Repository<GroupModulePermission>,
  ) {}
}
