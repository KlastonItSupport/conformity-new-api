import { IsString, IsOptional, IsInt, IsDate, IsUUID } from 'class-validator';

export class AuditDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  module?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  description: string;
}
