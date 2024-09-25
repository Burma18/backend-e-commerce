import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsString()
  @IsOptional()
  name?: string;
}
