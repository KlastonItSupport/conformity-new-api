import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class PermissionsDto {
  @IsNumber()
  canAdd: number;

  @IsNumber()
  canRead: number;

  @IsNumber()
  canEdit: number;

  @IsNumber()
  canDelete: number;
}

export class AllPermissionsDto {
  userId: string;
  documents: PermissionsDto;
  tasks: PermissionsDto;
  equipments: PermissionsDto;
  indicators: PermissionsDto;
  crm: PermissionsDto;
  training: PermissionsDto;
  companies: PermissionsDto;
}

export class CreatePermissionByGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;

  permissions: GroupPermissions;
  @IsNotEmpty()
  users: [string];
}

export class CreateGroupPermissionModule {
  groupId: string;
  permissionsId: string;
}

export class GroupPermissions {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  documents: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  tasks: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  equipments: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  indicators: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  crm: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  training: PermissionsDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  companies: PermissionsDto;
}
