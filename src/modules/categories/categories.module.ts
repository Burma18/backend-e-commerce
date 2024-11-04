import { Module } from '@nestjs/common';
import { CategoryAdminController } from './controllers/categories.admin.controller';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/categories.controller';

@Module({
  controllers: [CategoryAdminController, CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoriesModule {}
