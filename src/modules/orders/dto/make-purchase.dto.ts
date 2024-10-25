import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@src/modules/products/dto/create-product.dto';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class MakePurchaseDto {
  @ApiProperty({ type: [Number], description: 'Array of order IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  orderIds: number[];

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;
}

export class MakePurchaseResponse {
  @ApiProperty({
    description: 'ID of the order',
  })
  orderId: number;

  @ApiProperty({
    description: 'Total price of the order',
  })
  totalPrice: number;

  @ApiProperty({
    type: [ProductResponseDto],
    description: 'List of products in the order',
  })
  products: ProductResponseDto[];
}

export class MakePurchaseOverallResponse {
  @ApiProperty({
    type: [MakePurchaseResponse],
    description: 'List of purchases made',
  })
  purchases: MakePurchaseResponse[];

  @ApiProperty({
    description: 'Remaining balance after the orders',
  })
  remainingBalance: string;
}
