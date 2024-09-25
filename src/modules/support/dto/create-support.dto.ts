import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ description: 'The support message from the user' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
