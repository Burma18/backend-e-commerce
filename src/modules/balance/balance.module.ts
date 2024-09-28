import { Module } from '@nestjs/common';
import { BalanceController } from './controllers/balance-controller';
import { BalanceAdminController } from './controllers/balance-admin.controller';
import { BalanceService } from './services/balance.services';
@Module({
  controllers: [BalanceController, BalanceAdminController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
