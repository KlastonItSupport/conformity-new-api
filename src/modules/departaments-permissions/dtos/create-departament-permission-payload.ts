import { IsNotEmpty } from 'class-validator';

export class CreateDepartamentPermissionPayload {
  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  departaments: string[];

  isAuthorized: boolean;
}
