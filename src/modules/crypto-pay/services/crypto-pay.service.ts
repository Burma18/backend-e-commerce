import { Injectable } from '@nestjs/common';
import {
  CryptoPay,
  PaymentUpdate,
  Invoice,
  AppInfo,
} from '@foile/crypto-pay-api';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { environment } from '@src/environment';
import { BalanceService } from '@src/modules/balance/services/balance.services';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { PaymentStatus } from '@src/modules/payments/enums/payment-status.enum';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CryptoPayService {
  private cryptoPay: CryptoPay;
  private paymentRepository: Repository<Payment>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly balanceService: BalanceService,
  ) {
    this.paymentRepository = this.entityManager.getRepository(Payment);
    const token = environment.payment.cryptoPayToken;
    this.cryptoPay = new CryptoPay(token, {
      hostname: 'testnet-pay.crypt.bot',
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

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<string> {
    const { amount, userId, orderId } = createInvoiceDto;

    const payment = this.paymentRepository.create({
      user: { id: userId },
      order: { id: orderId },
      status: PaymentStatus.INIT,
      amount,
    });

    await this.paymentRepository.save(payment);

    try {
      const invoice: Invoice = await this.cryptoPay.createInvoice(
        'TON',
        amount,
        {
          description: 'Пополнение баланса',
          payload: JSON.stringify({ paymentId: payment.id }),
        },
      );

      console.log('invoice :', invoice);
      console.log('payment :', payment);

      return invoice.pay_url;
    } catch (error) {
      throw new Error(`Error creating invoice: ${error}`);
    }
  }

  async handleInvoicePaid(webhook: PaymentUpdate): Promise<void> {
    try {
      console.log('Webhook received', webhook);

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
        const amountPaid = parseFloat(webhookPayload.paid_amount);

        const payment = await this.paymentRepository.findOne({
          where: { id: paymentId },
          relations: ['user'],
        });

        if (!payment) {
          console.error(`Payment not found for paymentId: ${paymentId}`);
          return;
        }

        payment.status = PaymentStatus.PAID;
        payment.invoiceId = webhookPayload.invoice_id;
        payment.paymentUrl = webhookPayload.pay_url;
        payment.paymentConfirmedAt = new Date(webhookPayload.paid_at);
        payment.currencyType = webhookPayload.currency_type;
        payment.paidAsset = webhookPayload.paid_asset;
        payment.feeAmount = parseFloat(webhookPayload.fee_amount);
        payment.paidAmount = amountPaid;

        await this.paymentRepository.save(payment);

        await this.paymentRepository.save(payment);

        await this.balanceService.addUserBalance(payment.user.id, amountPaid);
      } else {
        console.error('Invalid payment currency or amount');
      }
    } catch (error) {
      console.error(`Error processing payment update: ${error}`);
      throw new Error('Payment processing failed.');
    }
  }
}
