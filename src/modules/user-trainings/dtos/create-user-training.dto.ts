import {
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateTrainingUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  certificateId?: string;

  @IsOptional()
  @IsInt()
  trainingId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
