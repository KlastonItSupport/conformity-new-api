import { IsNotEmpty } from 'class-validator';

export class CreateRootCausePayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  routeCause: string;
}
