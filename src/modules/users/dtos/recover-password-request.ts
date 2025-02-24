import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string;
  
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    newPassword: string;
  }
  