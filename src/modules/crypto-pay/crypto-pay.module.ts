import { Module } from '@nestjs/common';
import { CryptoPayService } from './services/crypto-pay.service';
import { CryptoPayController } from './controllers/crypto-pay.controller';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [BalanceModule],
  providers: [CryptoPayService],
  exports: [CryptoPayService],
  controllers: [CryptoPayController],
})
export class CryptoPayModule {}
