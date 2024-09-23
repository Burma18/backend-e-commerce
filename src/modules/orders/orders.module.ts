import { Module } from '@nestjs/common';
import { OrderController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
