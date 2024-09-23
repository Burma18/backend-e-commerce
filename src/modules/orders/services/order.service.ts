import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '@src/modules/orders/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItem } from '@src/modules/orders/entities/order-item.entity';
import { OrderItemDto } from '../dto/order-item.dto';

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

  private mapOrderItems(orderItemsDto: OrderItemDto[]): OrderItem[] {
    return orderItemsDto.map((itemDto) => {
      const orderItem = new OrderItem();
      orderItem.product = { id: itemDto.productId } as any;
      orderItem.quantity = itemDto.quantity;
      return orderItem;
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = this.entityManager.create(Order, {
      totalPrice: createOrderDto.totalPrice,
      orderItems: this.mapOrderItems(createOrderDto.orderItems),
    });
    return this.repository.save(newOrder);
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    const order = await this.findOne(id);
    if (!order) return null;

    if (updateOrderDto.totalPrice !== undefined) {
      order.totalPrice = updateOrderDto.totalPrice;
    }

    if (updateOrderDto.orderItems) {
      order.orderItems = this.mapOrderItems(updateOrderDto.orderItems);
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    return this.repository.save(order);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
