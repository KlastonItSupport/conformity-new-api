import {
  IsString,
  IsInt,
  IsDate,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateIndicatorAnswerDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsInt()
  @IsNotEmpty()
  indicatorId: number;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  reason?: string;
}
