import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  orderId: number;
}
