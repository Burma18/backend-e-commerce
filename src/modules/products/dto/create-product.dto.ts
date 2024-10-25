import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'A high-end gaming laptop',
  })
  @IsOptional()
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
  @ApiProperty({
    description: 'An array of credentials objects',
    example: [
      { username: 'admin', password: 'secret' },
      { username: 'user', password: 'password123' },
    ],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  credentials: Record<string, any>[];

  @ApiProperty({ description: 'Telegram Id of the user' })
  @IsNotEmpty()
  @IsNumber()
  telegramId: number;
}
export class ProductResponseDto {
  @ApiProperty({ description: 'ID of the product' })
  productId: number;

  @ApiProperty({ description: 'Name of the product' })
  name: string;

  @ApiProperty({ description: 'Quantity of the product in the order' })
  quantity: number;

  @ApiProperty({ description: 'Price of the product' })
  price: number;

  @ApiProperty({ description: 'Credentials of the product' })
  credentials: Record<string, any>[];
}
