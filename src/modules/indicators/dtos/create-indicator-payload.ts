import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateIndicatorDto {
  @IsString()
  @IsNotEmpty()
  indicatorsCompanyFk: string;

  @IsString()
  @IsNotEmpty()
  indicatorsDepartmentFk: string;

  @IsInt()
  @IsOptional()
  collectDay?: number;

  @IsString()
  @IsNotEmpty()
  responsable: string;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  resulting: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsString()
  @IsNotEmpty()
  facts: string;

  @IsString()
  @IsNotEmpty()
  meta: string;

  @IsString()
  @IsNotEmpty()
  howToMeasure: string;

  @IsString()
  @IsNotEmpty()
  whatToMeasure: string;

  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  direction: string;
}