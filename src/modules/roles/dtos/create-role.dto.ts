import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  name: string;
}
