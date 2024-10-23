import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ example: 100, description: 'The amount of the invoice' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class InvoiceResponseDto {
  @ApiProperty({ example: 100, description: 'The balance of the user' })
  balance: string;
}
