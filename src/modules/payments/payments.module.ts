import { Module } from '@nestjs/common';
import { PaymentController } from './contollers/payments.controller';
import { PaymentService } from './services/payment.service';
import { PaymentAdminController } from './contollers/payments-admin.controller';

@Module({
  controllers: [PaymentController, PaymentAdminController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
