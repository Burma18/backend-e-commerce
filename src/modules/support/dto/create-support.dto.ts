import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ description: 'The support message from the user' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;
}
