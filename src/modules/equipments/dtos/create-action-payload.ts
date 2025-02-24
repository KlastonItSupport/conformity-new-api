import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';

export class CreateEquipmentActionDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  equipmentId: string;

  @IsOptional()
  @IsString()
  validity?: string;

  @IsOptional()
  @IsDate()
  nextDate?: Date;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  documents?: ConvertedFile[];
}
