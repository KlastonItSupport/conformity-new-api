import { IsNotEmpty } from 'class-validator';

export class CreateTrainingPayload {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  schoolId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  expirationInMonths: number;
}
