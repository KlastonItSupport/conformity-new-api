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
  project?: string;

  @IsOptional()
  departament?: string;
}
