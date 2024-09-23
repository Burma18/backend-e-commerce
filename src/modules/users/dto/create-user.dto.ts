import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  telegramId: string;

  @IsOptional()
  @IsNotEmpty()
  balance?: number;

  @IsNotEmpty()
  role: UserRole;
}
