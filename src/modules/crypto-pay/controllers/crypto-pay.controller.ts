import { Post, Body, Get } from '@nestjs/common';
import { PaymentService } from '../services/crypto-pay.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { AppInfo } from '@foile/crypto-pay-api';
import { UpdateInvoiceDto } from '../dto/payment-update.dto';
import { WebController } from '@src/common/decorators/web-controller.decorator';

@WebController({ routePrefix: 'payment', tagName: 'Payment' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('getMe')
  async getMe(): Promise<AppInfo> {
    return this.paymentService.getMe();
  }

  @Post('create-invoice')
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<string> {
    return this.paymentService.createInvoice(createInvoiceDto);
  }

  @Post('handle-payment')
  async handlePayment(@Body() update: UpdateInvoiceDto): Promise<void> {
    return this.paymentService.handleInvoicePaid(update);
  }
}
