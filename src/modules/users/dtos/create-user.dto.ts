import {
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  access?: boolean;

  @IsOptional()
  @IsBoolean()
  contractAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  leadAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  projectAccess?: boolean;

  @IsOptional()
  @IsString()
  accessRule?: string;

  @IsOptional()
  @IsString()
  departament?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsEmpty()
  @IsString()
  groupId?: string;
}
