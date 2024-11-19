import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateWarningDto {
  @IsOptional()
  @IsBoolean()
  showWarning?: boolean;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsOptional()
  @IsString()
  warningMessage?: string;

  @IsOptional()
  @IsDate()
  expiredAt?: Date;

  @IsOptional()
  id: number;
}
