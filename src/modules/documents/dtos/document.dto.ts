import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsUUID,
} from 'class-validator';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsNotEmpty()
  @IsString()
  validity: string;

  @IsOptional()
  @IsInt()
  revision?: number;

  // @IsNotEmpty()
  // @IsDateString()
  // sendDate: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsString()
  identification?: string;

  @IsOptional()
  @IsString()
  protection?: string;

  @IsOptional()
  @IsString()
  recovery?: string;

  @IsOptional()
  @IsDateString()
  minimumRetention?: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  revisionDate?: Date;

  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsUUID()
  departamentId: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsOptional()
  document: ConvertedFile[];
}
