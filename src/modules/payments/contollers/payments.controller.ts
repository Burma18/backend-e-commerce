import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from '@src/modules/payments/services/payment.service';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { AdminGuard } from '@src/modules/auth/guards/admin-guard';
@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all payments',
    type: [Payment],
  })
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment | null> {
    return this.paymentService.findOneBy(id);
  }

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: Payment,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({ summary: 'Update a payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Put(':id')
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiOperation({ summary: 'Delete a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deletePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.delete(id);
  }
}
