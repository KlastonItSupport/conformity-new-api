import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  name: string;
}
