import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  certified?: string;

  @IsOptional()
  @IsString()
  range?: string;

  @IsOptional()
  @IsString()
  tolerancy?: string;
}
