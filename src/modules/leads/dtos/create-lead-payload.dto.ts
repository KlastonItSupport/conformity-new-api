import {
  IsInt,
  IsString,
  IsOptional,
  IsDate,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsNotEmpty()
  @IsInt()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  crmCompanyId: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  responsable: string;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  contract?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  celphone?: string;

  @IsOptional()
  @IsInt()
  solicitationMonth?: number;

  @IsOptional()
  @IsInt()
  solicitationYear?: number;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
