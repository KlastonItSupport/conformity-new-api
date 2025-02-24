import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  moduleId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber()
  canAdd;

  @IsNumber()
  canRead;

  @IsNumber()
  canEdit;

  @IsNumber()
  canDelete;
}
