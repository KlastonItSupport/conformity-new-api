import { IsOptional } from 'class-validator';

export class SearchSelectsDto {
  @IsOptional()
  initialDate?: Date;

  @IsOptional()
  finalDate?: Date;

  @IsOptional()
  departamentId?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  author?: string;
}
