import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'A high-end gaming laptop',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the product', example: 999.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The ID of the category the product belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
