import ConvertedFile from 'src/modules/shared/dtos/converted-file';

export class CreateAdditionalDocumentsDto {
  documents: ConvertedFile[];
  taskId: number;
  userId: string;
  companyId: string;
}
