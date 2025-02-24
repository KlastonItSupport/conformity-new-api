import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupportCase {
  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userEmail: string;

  @IsNotEmpty()
  issueDepartment: string;

  @IsNotEmpty()
  priority: string;

  @IsOptional()
  description: string;

  @IsOptional()
  attachments;
}
// subject
// userName
// userEmail
// issueDepartment
// priority
// attachments
// description
