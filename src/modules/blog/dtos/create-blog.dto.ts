import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  seo: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  resume: string;

  @IsDate()
  @IsNotEmpty()
  exbitionDate: Date;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsInt()
  @IsNotEmpty()
  blogCategoryId: number;
}
