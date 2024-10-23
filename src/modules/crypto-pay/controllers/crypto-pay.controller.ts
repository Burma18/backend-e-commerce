import { Post, Body, Get } from '@nestjs/common';
import { PaymentService } from '../services/crypto-pay.service';
import {
  CreateInvoiceDto,
  InvoiceResponseDto,
} from '../dto/create-invoice.dto';
import { AppInfo } from '@foile/crypto-pay-api';
import { UpdateInvoiceDto } from '../dto/payment-update.dto';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import { GetJwtPayload } from '@src/common/decorators/get-jwt-payload.decorator';
import { ApiResponse } from '@nestjs/swagger';

@WebController({ routePrefix: 'payment', tagName: 'Payment' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('getMe')
  async getMe(): Promise<AppInfo> {
    return this.paymentService.getMe();
  }

  @Post('create-invoice')
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully, returns the payment URL.',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: {
          type: 'string',
          example: 'https://pay.crypto.com/invoice/12345',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input',
  })
  async createInvoice(
    @GetJwtPayload() user: IJwtPayload,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ paymentUrl: string }> {
    return await this.paymentService.createInvoice(createInvoiceDto, user.id);
  }

  @Post('handle-payment')
  async handlePayment(
    @Body() update: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto | void> {
    return await this.paymentService.handleInvoicePaid(update);
  }
}
