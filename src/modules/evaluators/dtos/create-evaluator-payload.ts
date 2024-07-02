import { IsOptional, IsNotEmpty } from 'class-validator';

export class EvaluatorCreatePayload {
  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  approved: number;

  @IsNotEmpty()
  reviewed: number;

  @IsNotEmpty()
  cancelled: number;

  @IsNotEmpty()
  deleted: number;

  @IsNotEmpty()
  edited: number;

  @IsOptional()
  cancelDescription?: string;
}
