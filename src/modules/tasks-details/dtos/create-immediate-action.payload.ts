import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateImmediateActionPayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  date: Date;

  @IsOptional()
  responsable?: string;
}
