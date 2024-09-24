import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartDto {
  @ApiProperty({ description: 'The Telegram ID of the user' })
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
