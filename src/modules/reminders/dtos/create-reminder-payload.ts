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
  data;
  End: Date;

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

// id
// module - varchar
// key - varchar
// frequency - varchar
// hour - varchar
// date_last_reminder - date
// date_register(created_at) - timestamp
// data_end - date
// status - varchar
// monday - int
// tuesday - int
// wednesday - int
// thursday - int
// friday - int
// saturday - int
// sunday - int
// week_day - varchar
// close_day - date
// text - varchar
