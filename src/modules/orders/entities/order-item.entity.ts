import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '@src/modules/products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Product, (product) => product)
  product: Product;

  @Column()
  quantity: number;
}
