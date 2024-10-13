import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '@src/modules/orders/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItemDto } from '../dto/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '@src/modules/products/entities/product.entity';
@Injectable()
export class OrderService {
  private repository: Repository<Order>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderItems = this.mapOrderItems(createOrderDto.orderItems);

    const totalPrice = await this.calculateTotalPrice(orderItems);

    const newOrder = this.entityManager.create(Order, {
      totalPrice,
      orderItems,
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
  ): Promise<Order | null> {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    if (updateOrderDto.orderItems) {
      order.orderItems = this.mapOrderItems(updateOrderDto.orderItems);
      order.totalPrice = await this.calculateTotalPrice(order.orderItems);
    }

    return await this.repository.save(order);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
