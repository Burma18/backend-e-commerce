import { Module } from '@nestjs/common';
import { PaymentService } from './services/crypto-pay.service';
import { PaymentController } from './controllers/crypto-pay.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
