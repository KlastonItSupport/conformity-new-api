import { IsOptional, IsNotEmpty } from 'class-validator';

export class EvaluatorCreatePayload {
  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  approved: boolean;

  @IsNotEmpty()
  reviewed: boolean;

  @IsNotEmpty()
  cancelled: boolean;

  @IsNotEmpty()
  deleted: boolean;

  @IsNotEmpty()
  edited: boolean;

  @IsOptional()
  cancelDescription?: string;
}
