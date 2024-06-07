import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  name: string;
}
