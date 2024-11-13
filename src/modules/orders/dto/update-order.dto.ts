import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ description: 'Telegram ID of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the product to update',
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Quantity of the product to update',
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
