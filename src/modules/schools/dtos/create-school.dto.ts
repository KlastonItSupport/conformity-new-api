import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  celphone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
