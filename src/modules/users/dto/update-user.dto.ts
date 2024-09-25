import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Updated username of the user', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Updated balance of the user', required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;

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
}
