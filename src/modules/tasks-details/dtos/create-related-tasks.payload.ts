import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRelatedTasksPayload {
  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  initialDate?: string;

  @IsNotEmpty()
  endDate?: string;

  @IsOptional()
  completed?: boolean;
}
