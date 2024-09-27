import { Module } from '@nestjs/common';
import { OrderController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';
import { OrderAdminController } from './controllers/orders-admin.controller';

@Module({
  controllers: [OrderController, OrderAdminController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
