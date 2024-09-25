import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Telegram ID of the user' })
  @IsNotEmpty()
  @IsString()
  telegramId: string;

  @ApiProperty({ description: 'Balance of the user', required: false })
  @IsOptional()
  @IsNotEmpty()
  balance?: number;

  @ApiProperty({ description: 'Role of the user' })
  @IsNotEmpty()
  role: UserRole;
}
