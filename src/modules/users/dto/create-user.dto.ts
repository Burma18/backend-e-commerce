import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Telegram ID of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;

  @ApiProperty({ description: 'Balance of the user', required: false })
  @IsOptional()
  @IsString()
  balance?: string;

  @ApiProperty({ description: 'Role of the user' })
  @IsNotEmpty()
  role: UserRole;
}
