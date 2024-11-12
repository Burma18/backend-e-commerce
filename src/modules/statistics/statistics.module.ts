import { Module } from '@nestjs/common';
import { AdminStatisticController } from './controllers/statistics-admin.controller';
import { StatisticsService } from './services/statistics.service';
import { UsersModule } from '../users/users.module';
import { PaymentModule } from '../crypto-pay/crypto-pay.module';

@Module({
  imports: [UsersModule, PaymentModule],
  providers: [StatisticsService],
  controllers: [AdminStatisticController],
})
export class StatisticsModule {}
