import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedPayloadDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  externalId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  moduleId: string;

  @IsNotEmpty()
  companyId: string;
}
