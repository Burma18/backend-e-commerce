import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNewsletterDto {
  @ApiProperty({ description: 'Message content of the newsletter' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;
}
