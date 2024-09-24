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
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrderModule,
    PaymentsModule,
    NewsletterModule,
    SupportModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
