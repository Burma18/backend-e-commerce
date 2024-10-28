import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartDto {
  @ApiProperty({ description: 'The Telegram ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  telegramId: number;

  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
