import { IsNotEmpty } from 'class-validator';

export class CreateDocumentRevisionPayloadDto {
  @IsNotEmpty()
  revisionDate: Date;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  userId: string;
}
