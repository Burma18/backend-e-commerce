import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Updated username of the user', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Updated balance of the user', required: false })
  @IsOptional()
  @IsString()
  balance?: string;

  @ApiProperty({
    description: 'Status indicating whether the user is blocked',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiProperty({ description: 'Updated role of the user', required: false })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;

  @ApiProperty({
    description: 'Status indicating if user wants to receive newsletter',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  receiveNewsletter: boolean;
}
