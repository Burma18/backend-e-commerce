import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsletterDto {
  @ApiProperty({ description: 'Message content of the newsletter' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
