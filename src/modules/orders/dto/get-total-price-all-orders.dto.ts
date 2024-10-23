import { ApiProperty } from '@nestjs/swagger';
import { Order } from '@src/modules/orders/entities/order.entity';

export class GetAllOrdersPriceResponseDto {
  @ApiProperty({ example: 100, description: 'Total price of all orders' })
  totalPrice: number;

  @ApiProperty({ type: [Order], description: 'List of orders' })
  orders: Order[];
}
