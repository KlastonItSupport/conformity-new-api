import { IsNotEmpty } from 'class-validator';

export class CreateDepartamentDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  name: string;
}
