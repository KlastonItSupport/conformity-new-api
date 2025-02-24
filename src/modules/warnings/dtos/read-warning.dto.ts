import { IsString, IsNotEmpty } from 'class-validator';

export class ReadWarningDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  warningId: number;
}
