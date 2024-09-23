import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '@src/modules/admin/services/admin.service';
import { AuthGuard } from '@src/common/guards/auth-guard';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { UpdateProductDto } from '@src/modules/products/dto/update-product.dto';
import { CreateNewsletterDto } from '@src/modules/newsletter/dto/create-newsletter.dto';
import { User } from '@src/modules/users/entities/user.entity';
import { Product } from '@src/modules/products/entities/product.entity';
import { Category } from '@src/modules/categories/entities/category.entity';
import { Order } from '@src/modules/orders/entities/order.entity';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { Support } from '@src/modules/support/entities/support.entity';
import { Newsletter } from '@src/modules/newsletter/entities/newsletter.entity';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('statistics')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.getAllUsers();
  }

  @Get('products')
  async getAllProducts(): Promise<Product[]> {
    return this.adminService.getAllProducts();
  }

  @Get('categories')
  async getAllCategories(): Promise<Category[]> {
    return this.adminService.getAllCategories();
  }

  @Get('orders')
  async getAllOrders(): Promise<Order[]> {
    return this.adminService.getAllOrders();
  }

  @Get('payments')
  async getAllPayments(): Promise<Payment[]> {
    return this.adminService.getAllPayments();
  }

  @Get('support')
  async getAllSupportRequests(): Promise<Support[]> {
    return this.adminService.getAllSupportRequests();
  }

  @Get('newsletters')
  async getAllNewsletters(): Promise<Newsletter[]> {
    return this.adminService.getAllNewsletters();
  }

  @Put('user/:id/:action')
  async manageUser(
    @Param('id') userId: number,
    @Param('action') action: 'block' | 'unblock' | 'update',
    @Body() updateUserDto?: UpdateUserDto,
  ) {
    return this.adminService.manageUser(userId, action, updateUserDto);
  }

  @Put('product/:id/:action')
  async manageProduct(
    @Param('id') productId: number,
    @Param('action') action: 'edit' | 'delete',
    @Body() updateProductDto?: UpdateProductDto,
  ) {
    return this.adminService.manageProduct(productId, action, updateProductDto);
  }

  @Post('newsletter')
  async sendNewsletter(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.adminService.sendNewsletter(createNewsletterDto.message);
  }
}
