import { Injectable } from '@nestjs/common';
import { CryptoPay, Invoice, AppInfo } from '@foile/crypto-pay-api';
import {
  CreateInvoiceDto,
  InvoiceResponseDto,
} from '../dto/create-invoice.dto';
import { environment } from '@src/environment';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '@src/modules/users/services/user.service';
import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentService {
  private cryptoPay: CryptoPay;
  private paymentRepository: Repository<Payment>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
  ) {
    this.paymentRepository = this.entityManager.getRepository(Payment);
    const token =
      environment.app.env === 'prod'
        ? environment.payment.cryptoPayTokenProd
        : environment.payment.cryptoPayTokenTest;
    const hostName =
      environment.app.env === 'prod'
        ? environment.payment.hostNameProd
        : environment.payment.hostNameTest;

    this.cryptoPay = new CryptoPay(token, {
      hostname: hostName,
      protocol: 'https',
    });
  }

  async getMe(): Promise<AppInfo> {
    try {
      const appInfo: AppInfo = await this.cryptoPay.getMe();
      return appInfo;
    } catch (error) {
      throw new Error(`Error fetching app info: ${error}`);
    }
  }

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
    userId: number,
  ): Promise<{ paymentUrl: string }> {
    const { amount } = createInvoiceDto;

    const payment = this.paymentRepository.create({
      user: { id: userId },
      status: PaymentStatus.INIT,
      amount,
    });

    await this.paymentRepository.save(payment);

    const currency =
      environment.app.env === 'prod'
        ? environment.payment.currencyProd
        : environment.payment.currencyTest;

    try {
      const invoice: Invoice = await this.cryptoPay.createInvoice(
        currency,
        amount,
        {
          description: 'Пополнение баланса',
          payload: JSON.stringify({ paymentId: payment.id }),
        },
      );

      return { paymentUrl: invoice.pay_url };
    } catch (error) {
      throw new Error(`Error creating invoice: ${error}`);
    }
  }

  async handleInvoicePaid(webhook: any): Promise<InvoiceResponseDto | void> {
    try {
      if (webhook.update_type !== 'invoice_paid') {
        console.log('Ignored webhook: not an invoice_paid event');
        return;
      }

      const webhookPayload = webhook.payload;
      const parsedPayload = JSON.parse(webhookPayload.payload);
      const { paymentId } = parsedPayload;

      const supportedAssets = ['TON', 'USDT'];

      if (
        supportedAssets.includes(webhookPayload.paid_asset) &&
        parseFloat(webhookPayload.paid_amount) > 0
      ) {
        const amount = parseFloat(webhookPayload.amount);

        const payment = await this.paymentRepository.findOne({
          where: { id: paymentId },
          relations: ['user'],
        });

        if (!payment) {
          console.error(`Payment not found for paymentId: ${paymentId}`);
          return;
        }

        if (payment.status === PaymentStatus.PAID) {
          return;
        }

        payment.status = PaymentStatus.PAID;
        payment.invoiceId = webhookPayload.invoice_id;
        payment.paymentUrl = webhookPayload.pay_url;
        payment.paymentConfirmedAt = new Date(webhookPayload.paid_at);
        payment.currencyType = webhookPayload.currency_type;
        payment.paidAsset = webhookPayload.paid_asset;
        payment.feeAmount = parseFloat(webhookPayload.fee_amount);
        payment.paidAmount = webhookPayload.paid_amount;

        await this.paymentRepository.save(payment);

        await this.paymentRepository.save(payment);

        await this.userService.addUserBalance(payment.user.id, amount);

        return;
      } else {
        console.error('Invalid payment currency or amount');
      }
    } catch (error) {
      console.error(`Error processing payment update: ${error}`);
      throw new Error('Payment processing failed.');
    }
  }
}
