import { Get, Post, Put, Param, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '@src/modules/payments/services/payment.service';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@WebController({ routePrefix: 'payment', tagName: 'Payment' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Payment } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment | null> {
    return this.paymentService.findOneBy(id);
  }

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Payment } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
  ])
  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({ summary: 'Update a payment by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Payment } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Put(':id')
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    return this.paymentService.update(id, updatePaymentDto);
  }
}
