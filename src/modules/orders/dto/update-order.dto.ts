import { IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 150,
    description: 'Updated total price of the order',
  })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({
    type: [OrderItemDto],
    description: 'Updated list of order items',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[];

  @ApiPropertyOptional({
    enum: OrderStatus,
    description: 'Updated status of the order',
  })
  @IsOptional()
  status?: OrderStatus;
}
