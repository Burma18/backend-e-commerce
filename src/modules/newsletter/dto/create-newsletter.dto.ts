import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsletterDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
