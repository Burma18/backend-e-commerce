import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '@src/modules/users/services/user.service';
import { ProductService } from '@src/modules/products/services/product.service';
import { NewsletterService } from '@src/modules/newsletter/services/newsletter.service';
import { User } from '@src/modules/users/entities/user.entity';
import { Product } from '@src/modules/products/entities/product.entity';
import { CategoryService } from '@src/modules/categories/services/category.service';
import { OrderService } from '@src/modules/orders/services/order.service';
import { SupportService } from '@src/modules/support/services/support.service';
import { PaymentService } from '@src/modules/payments/services/payment.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly supportService: SupportService,
    private readonly newsletterService: NewsletterService,
  ) {}

  async getStatistics() {
    const totalUsers = await this.userService.countUsers();
    const totalPurchases = await this.userService.countPurchasesToday();
    return { totalUsers, totalPurchases };
  }

  async manageUser(
    userId: number,
    action: 'block' | 'unblock' | 'update',
    updateData?: Partial<User>,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    switch (action) {
      case 'block':
        user.isBlocked = true;
        await this.userService.update(userId, user);
        break;
      case 'unblock':
        user.isBlocked = false;
        await this.userService.update(userId, user);
        break;
      case 'update':
        if (updateData) {
          await this.userService.update(userId, updateData);
        }
        break;
    }

    return user;
  }

  async manageProduct(
    productId: number,
    action: 'edit' | 'delete',
    updateData?: Partial<Product>,
  ) {
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    switch (action) {
      case 'edit':
        if (updateData) {
          await this.productService.update(productId, updateData);
        }
        break;
      case 'delete':
        await this.productService.delete(productId);
        break;
    }

    return product;
  }

  async sendNewsletter(message: string) {
    await this.newsletterService.create({ message });
  }

  async getAllUsers() {
    return this.userService.findAll();
  }

  async getAllProducts() {
    return this.productService.findAll();
  }

  async getAllCategories() {
    return this.categoryService.findAll();
  }

  async getAllOrders() {
    return this.orderService.findAll();
  }

  async getAllPayments() {
    return this.paymentService.findAll();
  }

  async getAllSupportRequests() {
    return this.supportService.findAll();
  }

  async getAllNewsletters() {
    return this.newsletterService.findAll();
  }
}
