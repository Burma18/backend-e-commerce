import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductAdminController } from './controllers/product-admin.controller';

@Module({
  providers: [ProductService],
  controllers: [ProductController, ProductAdminController],
  exports: [ProductService],
})
export class ProductsModule {}
