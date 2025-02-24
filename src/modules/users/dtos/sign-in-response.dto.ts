import { IsNotEmpty } from 'class-validator';

export class SignInResponse {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  accessRule: string;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  companyName: string;

  celphone?: string;
  profilePic?: string;
  birthDate?: Date;
}
