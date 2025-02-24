import { IsNotEmpty } from 'class-validator';

export class CreateRootCauseAnalysisPayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  why: string;

  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  date: Date;
}
