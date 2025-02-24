import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReminderPayload {
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  frequency: string;

  @IsOptional()
  sunday: number;

  @IsOptional()
  monday: number;

  @IsOptional()
  tuesday: number;

  @IsOptional()
  wednesday: number;

  @IsOptional()
  thursday: number;

  @IsOptional()
  friday: number;

  @IsOptional()
  saturday: number;

  @IsNotEmpty()
  hour: string;

  @IsOptional()
  text: string;

  @IsOptional()
  key?: string | number;
  @IsOptional()
  module?: string;

  @IsOptional()
  dataEnd: Date;
}
