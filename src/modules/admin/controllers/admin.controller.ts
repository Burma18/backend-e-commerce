import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from '@src/modules/admin/services/admin.service';
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
import { AdminGuard } from '@src/modules/auth/guards/admin-guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get admin statistics' })
  @ApiResponse({ status: 200, description: 'Statistics fetched successfully.' })
  @Get('statistics')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', type: [User] })
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products.',
    type: [Product],
  })
  @Get('products')
  async getAllProducts(): Promise<Product[]> {
    return this.adminService.getAllProducts();
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories.',
    type: [Category],
  })
  @Get('categories')
  async getAllCategories(): Promise<Category[]> {
    return this.adminService.getAllCategories();
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders.',
    type: [Order],
  })
  @Get('orders')
  async getAllOrders(): Promise<Order[]> {
    return this.adminService.getAllOrders();
  }

  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all payments.',
    type: [Payment],
  })
  @Get('payments')
  async getAllPayments(): Promise<Payment[]> {
    return this.adminService.getAllPayments();
  }

  @ApiOperation({ summary: 'Get all support requests' })
  @ApiResponse({
    status: 200,
    description: 'List of all support requests.',
    type: [Support],
  })
  @Get('support')
  async getAllSupportRequests(): Promise<Support[]> {
    return this.adminService.getAllSupportRequests();
  }

  @ApiOperation({ summary: 'Get all newsletters' })
  @ApiResponse({
    status: 200,
    description: 'List of all newsletters.',
    type: [Newsletter],
  })
  @Get('newsletters')
  async getAllNewsletters(): Promise<Newsletter[]> {
    return this.adminService.getAllNewsletters();
  }

  @ApiOperation({ summary: 'Manage user: block, unblock, or update' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({
    name: 'action',
    description: 'Action to be performed: block, unblock, or update',
  })
  @ApiBody({ type: UpdateUserDto, required: false })
  @ApiResponse({ status: 200, description: 'User management successful.' })
  @Put('user/:id/:action')
  async manageUser(
    @Param('id') userId: number,
    @Param('action') action: 'block' | 'unblock' | 'update',
    @Body() updateUserDto?: UpdateUserDto,
  ) {
    return this.adminService.manageUser(userId, action, updateUserDto);
  }

  @ApiOperation({ summary: 'Manage product: edit or delete' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({
    name: 'action',
    description: 'Action to be performed: edit or delete',
  })
  @ApiBody({ type: UpdateProductDto, required: false })
  @ApiResponse({ status: 200, description: 'Product management successful.' })
  @Put('product/:id/:action')
  async manageProduct(
    @Param('id') productId: number,
    @Param('action') action: 'edit' | 'delete',
    @Body() updateProductDto?: UpdateProductDto,
  ) {
    return this.adminService.manageProduct(productId, action, updateProductDto);
  }

  @ApiOperation({ summary: 'Send newsletter' })
  @ApiBody({ type: CreateNewsletterDto })
  @ApiResponse({ status: 200, description: 'Newsletter sent successfully.' })
  @Post('newsletter')
  async sendNewsletter(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.adminService.sendNewsletter(createNewsletterDto.message);
  }
}
