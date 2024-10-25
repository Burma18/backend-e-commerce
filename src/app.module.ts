import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '@src/config/typeorm.config';
import { UsersModule } from '@src/modules/users/users.module';
import { OrderModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ProductsModule } from './modules/products/products.module';
import { SupportModule } from './modules/support/support.module';
import { APP_GUARD } from '@nestjs/core';
// import { JwtGuard } from './modules/auth/guards/jwt-guard';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/crypto-pay/crypto-pay.module';
import { TelegramGuard } from './modules/auth/guards/telegram.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfig,
    }),
    UsersModule,
    OrderModule,
    CategoriesModule,
    NewsletterModule,
    ProductsModule,
    SupportModule,
    AuthModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TelegramGuard,
    },
  ],
})
export class AppModule {}
