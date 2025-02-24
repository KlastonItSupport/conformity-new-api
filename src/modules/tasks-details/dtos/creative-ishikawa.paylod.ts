import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreativeIshikawaPayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsOptional()
  method: string;

  @IsOptional()
  machine: string;

  @IsOptional()
  material: string;

  @IsOptional()
  workHand: string;

  @IsOptional()
  measure: string;

  @IsOptional()
  environment: string;
}
