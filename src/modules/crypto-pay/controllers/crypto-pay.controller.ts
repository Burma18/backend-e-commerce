import { Controller, Post, Body, Get } from '@nestjs/common';
import { CryptoPayService } from '../services/crypto-pay.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { AppInfo } from '@foile/crypto-pay-api';

@Controller('crypto-pay')
export class CryptoPayController {
  constructor(private readonly cryptoPayService: CryptoPayService) {}

  @Get('getMe')
  async getMe(): Promise<AppInfo> {
    return this.cryptoPayService.getMe();
  }

  @Post('create-invoice')
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<string> {
    return this.cryptoPayService.createInvoice(createInvoiceDto);
  }

  @Post('handle-payment')
  async handlePayment(@Body() update: any): Promise<void> {
    return this.cryptoPayService.handleInvoicePaid(update);
  }
}
