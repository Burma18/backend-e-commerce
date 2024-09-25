import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { Order } from '@src/modules/orders/entities/order.entity';
import { PaymentStatus } from '@src/modules/payments/enums/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;
}
