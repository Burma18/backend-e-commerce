import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  role?: UserRole;
}
