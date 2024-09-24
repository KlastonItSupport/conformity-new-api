import { IsNotEmpty } from 'class-validator';

export class CreateServicePayload {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  companyId: string;
}
