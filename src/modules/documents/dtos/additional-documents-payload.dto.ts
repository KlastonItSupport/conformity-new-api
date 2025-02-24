import ConvertedFile from 'src/modules/shared/dtos/converted-file';

export class AdditionalDocumentsPayloadDto {
  documents: ConvertedFile[];
  id: string;
  userId: string;
}
