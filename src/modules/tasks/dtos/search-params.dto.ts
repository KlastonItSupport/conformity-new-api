import { IsOptional } from 'class-validator';

export class TasksSearchParams {
  @IsOptional()
  status?: string;

  @IsOptional()
  origin?: string;

  @IsOptional()
  classification?: string;

  @IsOptional()
  type?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  departament?: string;
}
