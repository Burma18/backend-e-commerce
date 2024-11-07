import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Order } from '@src/modules/orders/entities/order.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItemDto } from '../dto/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '@src/modules/products/entities/product.entity';
import { OrderStatus } from '../enums/order.status.enum';
import { UserService } from '@src/modules/users/services/user.service';
import { MakePurchaseOverallResponse } from '../dto/make-purchase.dto';
import { GetAllOrdersPriceResponseDto } from '../dto/get-total-price-all-orders.dto';
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

  async findAllByUser(userId: number, status?: OrderStatus): Promise<Order[]> {
    const query = this.repository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    return await query.getMany();
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

  async create(userId: number, createOrderDto: OrderItemDto): Promise<Order> {
    const orderItem = this.mapOrderItems(createOrderDto);

    const totalPrice = await this.calculateTotalPrice(orderItem);

    const newOrder = this.entityManager.create(Order, {
      userId,
      totalPrice,
      items: orderItem,
    });

    return this.repository.save(newOrder);
  }

  async calculateTotalPriceOfOrders(
    userId: number,
  ): Promise<GetAllOrdersPriceResponseDto> {
    const orders = await this.findAllByUser(userId, OrderStatus.PENDING);
    const orderItems = this.mapOrders(orders);

    const totalPrice = await this.calculateTotalPrice(orderItems);

    return { totalPrice, orders };
  }

  private mapOrders(orders: Order[]): OrderItem[] {
    const orderItems: OrderItem[] = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const orderItem = new OrderItem();
        orderItem.orderId = order.id;
        orderItem.product = item.product;
        orderItem.quantity = item.quantity;

        orderItems.push(orderItem);
      });
    });

    return orderItems;
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

  private mapOrderItems(
    orderItemsDto: OrderItemDto | OrderItemDto[],
  ): OrderItem[] {
    const items = Array.isArray(orderItemsDto)
      ? orderItemsDto
      : [orderItemsDto];

    return items.map((itemDto) => {
      const orderItem = new OrderItem();
      orderItem.product = { id: itemDto.productId } as Product;
      orderItem.quantity = itemDto.quantity;
      return orderItem;
    });
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
    await this.repository.softDelete(id);
  }

  async makePurchaseAllOrders(
    userId: number,
  ): Promise<MakePurchaseOverallResponse> {
    const orders = await this.findAllByUser(userId, OrderStatus.PENDING);

    const { balance } = await this.userService.getUserBalance(userId);
    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0,
    );

    if (parseFloat(balance) < totalAmount) {
      throw new BadRequestException(
        `Недостаточно средств на балансе. Пополните, пожалуйста, ваш баланс.`,
      );
    }

    const updatedBalance = parseFloat(balance) - totalAmount;

    await this.userService.addUserBalance(userId, -totalAmount);

    const purchaseResponses = await Promise.all(
      orders.map(async (order) => {
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
        };
      }),
    );

    return {
      purchases: purchaseResponses,
      remainingBalance: updatedBalance.toString(),
    };
  }

  async makePurchase(
    userId: number,
    orderIds: number[],
  ): Promise<MakePurchaseOverallResponse> {
    const orders = await this.repository.find({
      where: {
        id: In(orderIds),
      },
      relations: ['items', 'items.product'],
    });

    if (orders.length !== orderIds.length) {
      throw new NotFoundException(`One or more orders not found`);
    }

    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0,
    );

    const { balance } = await this.userService.getUserBalance(userId);

    if (parseFloat(balance) < totalAmount) {
      throw new BadRequestException(
        `Недостаточно средств на балансе. Пополните, пожалуйста, ваш баланс.`,
      );
    }

    const updatedBalance = parseFloat(balance) - totalAmount;

    await this.userService.addUserBalance(userId, -totalAmount);

    const purchaseResponses = await Promise.all(
      orders.map(async (order) => {
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
        };
      }),
    );

    return {
      purchases: purchaseResponses,
      remainingBalance: updatedBalance.toString(),
    };
  }
}
