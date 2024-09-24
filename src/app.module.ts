import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '@src/config/typeorm.config';
import { UsersModule } from '@src/modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrderModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ProductsModule } from './modules/products/products.module';
import { SupportModule } from './modules/support/support.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfig,
    }),
    UsersModule,
    AdminModule,
    PaymentsModule,
    OrderModule,
    CategoriesModule,
    NewsletterModule,
    ProductsModule,
    SupportModule,
  ],
})
export class AppModule {}
