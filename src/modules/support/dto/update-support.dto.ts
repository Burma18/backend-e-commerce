import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
  @ApiProperty({
    description: 'The response to the support message',
    required: false,
  })
  @IsOptional()
  @IsString()
  response?: string;
}
