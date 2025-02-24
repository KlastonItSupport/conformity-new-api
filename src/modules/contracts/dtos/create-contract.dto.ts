import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';

export class CreateContractDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsInt()
  crmCompaniesId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  initialDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  document?: ConvertedFile;
}
