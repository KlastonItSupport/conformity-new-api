import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Project } from 'src/modules/projects/entities/project.entity';

export class CreateCrmCompanyDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsOptional()
  personType: string;

  @IsString()
  @IsOptional()
  fantasyName: string;

  @IsString()
  @IsOptional()
  document: string;

  @IsString()
  @IsOptional()
  clientType: string;

  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  socialReason: string;

  @IsString()
  @IsOptional()
  cnpjCpf: string;

  @IsString()
  @IsOptional()
  passport: string;

  @IsString()
  @IsOptional()
  nacionality: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  citySubscription: string;

  @IsString()
  @IsOptional()
  stateSubscription: string;

  @IsString()
  @IsOptional()
  contact: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  celphone: string;

  @IsString()
  @IsOptional()
  cep: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  neighborhood: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  addressNumber: string;

  @IsString()
  @IsOptional()
  addressComplement: string;

  @IsBoolean()
  @IsOptional()
  supplier: boolean;

  @IsBoolean()
  @IsOptional()
  client: boolean;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNumber()
  @IsNotEmpty()
  cf: number;

  contracts?: Contract[];
  projects?: Project[];
}
