import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;

  @IsString()
  userId: string;

  @IsString()
  departamentId: string;

  @IsString()
  companyId: string;

  @IsString()
  company: any;

  @IsString()
  title: string;

  @IsDateString()
  datePrevision: string;

  @IsOptional()
  @IsDateString()
  dateConclusion?: Date;

  @IsString()
  status: string;

  origin: any;

  type: any;

  classification: any;

  @IsString()
  description: string;

  @IsString()
  resultRootCause: string;

  @IsString()
  correctiveAction: string;

  @IsString()
  immediateAction: string;

  @IsString()
  responsable: string;

  @IsString()
  dateCorrectiveAction: string;

  @IsString()
  dateImmediateAction: string;

  @IsString()
  @IsOptional()
  indicator?: number;
}
