import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCorrectiveActionsPayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  result: string;

  @IsNotEmpty()
  action: string;

  @IsOptional()
  responsable?: string;
}
