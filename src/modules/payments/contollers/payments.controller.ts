import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PaymentService } from '@src/modules/payments/services/payment.service';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment | null> {
    return this.paymentService.findOneBy(id);
  }

  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.delete(id);
  }
}
