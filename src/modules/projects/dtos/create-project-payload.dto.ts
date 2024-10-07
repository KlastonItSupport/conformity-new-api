import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectPayloadDto {
  @IsNotEmpty()
  progress: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  status: string;

  @IsOptional()
  initialDate: Date;

  @IsOptional()
  finalDate: Date;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  crmCompanyId: number;

  @IsNotEmpty()
  description: string;
}
