import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
  @ApiProperty({
    description: 'The response to the support message',
    required: false,
  })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  override telegramId: number;
}
