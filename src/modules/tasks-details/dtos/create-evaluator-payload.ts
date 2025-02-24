import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEvaluatorDto {
  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  usersIds: any;

  @IsOptional()
  analyzed: number;

  @IsOptional()
  data: string;
}
