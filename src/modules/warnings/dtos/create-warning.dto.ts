import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

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
}
