import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@src/modules/products/dto/create-product.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakePurchaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}

export class MakePurchaseResponse {
  @ApiProperty({ description: 'ID of the order' })
  orderId: number;

  @ApiProperty({ description: 'Total price of the order' })
  totalPrice: number;

  @ApiProperty({
    type: [ProductResponseDto],
    description: 'List of products in the order',
  })
  products: ProductResponseDto[];

  @ApiProperty({ description: 'Remaining balance after the order' })
  remainingBalance: string;
}
