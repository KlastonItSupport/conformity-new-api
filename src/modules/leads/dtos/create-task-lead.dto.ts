import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateLeadTaskDto {
  @IsOptional()
  @IsInt()
  leadId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsBoolean()
  isReminder?: boolean;

  @IsOptional()
  @IsBoolean()
  hasBeenReminded?: boolean;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
