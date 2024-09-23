import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { OrderModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { SupportModule } from '../support/support.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrderModule,
    PaymentsModule,
    NewsletterModule,
    SupportModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
