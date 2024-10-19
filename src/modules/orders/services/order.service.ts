import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '@src/modules/orders/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItemDto } from '../dto/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '@src/modules/products/entities/product.entity';
import { OrderStatus } from '../enums/order.status.enum';
import { UserService } from '@src/modules/users/services/user.service';
import { MakePurchaseResponse } from '../dto/make-purchase.dto';
@Injectable()
export class OrderService {
  private repository: Repository<Order>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
  ) {
    this.repository = this.entityManager.getRepository(Order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    console.log('userId', userId);
    console.log('typeof userId ', typeof userId);
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Order> {
    const whereCondition: any = { id };

    if (userId) {
      whereCondition.user = { id: userId };
    }

    const order = await this.repository.findOne({
      where: whereCondition,
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    return order;
  }

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const orderItems = this.mapOrderItems(createOrderDto.orderItems);

    const totalPrice = await this.calculateTotalPrice(orderItems);

    const newOrder = this.entityManager.create(Order, {
      userId,
      totalPrice,
      items: orderItems,
    });

    return this.repository.save(newOrder);
  }

  private mapOrderItems(orderItemsDto: OrderItemDto[]): OrderItem[] {
    return orderItemsDto.map((itemDto) => {
      const orderItem = new OrderItem();
      orderItem.product = { id: itemDto.productId } as Product;
      orderItem.quantity = itemDto.quantity;
      return orderItem;
    });
  }

  private async calculateTotalPrice(orderItems: OrderItem[]): Promise<number> {
    let total = 0;

    for (const item of orderItems) {
      const product = await this.entityManager.findOne(Product, {
        where: { id: item.product.id },
      });
      if (product) {
        total += product.price * item.quantity;
      } else {
        throw new NotFoundException(
          `Product with ID ${item.product.id} not found`,
        );
      }
    }

    return total;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    userId?: number,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (updateOrderDto.orderItems) {
      order.items = this.mapOrderItems(updateOrderDto.orderItems);
      order.totalPrice = await this.calculateTotalPrice(order.items);
    }

    return await this.repository.save(order);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async makePurchase(
    userId: number,
    orderId: number,
  ): Promise<MakePurchaseResponse> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const { balance } = await this.userService.getUserBalance(userId);

    if (parseFloat(balance) < order.totalPrice) {
      throw new BadRequestException(
        `Недостаточно средств на балансе. Пополните, пожалуйста, ваш баланс.`,
      );
    }

    const updatedBalance = parseFloat(balance) - order.totalPrice;

    await this.userService.addUserBalance(userId, -order.totalPrice);

    order.status = OrderStatus.PAID;
    await this.repository.save(order);

    return {
      orderId: order.id,
      totalPrice: order.totalPrice,
      products: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        credentials: item.product.credentials,
      })),
      remainingBalance: updatedBalance.toString(),
    };
  }
}
