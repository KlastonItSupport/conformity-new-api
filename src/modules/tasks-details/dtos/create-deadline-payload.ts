import { IsNotEmpty } from 'class-validator';

export class CreateDeadlinePayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  oldDate: Date;

  @IsNotEmpty()
  newDate: Date;

  @IsNotEmpty()
  description: string;
}
