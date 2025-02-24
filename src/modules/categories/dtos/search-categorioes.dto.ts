import { IsOptional } from 'class-validator';

export class SearchSelectsDto {
  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;

  @IsOptional()
  search: string;
}
