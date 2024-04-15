import { IsString } from 'class-validator';
import { GroupPermissions } from './create-permission-by-group';

export class EditPermissionByGroupDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  permissions: GroupPermissions;
  users: [string];
}
