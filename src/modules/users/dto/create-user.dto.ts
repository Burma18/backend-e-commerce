import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  telegramId: string;

  @IsNotEmpty()
  balance: number;

  @IsNotEmpty()
  role: UserRole;
}
