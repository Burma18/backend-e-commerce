import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID of the product' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;
}
