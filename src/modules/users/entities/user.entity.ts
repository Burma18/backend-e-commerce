import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@src/modules/users/enums/user-role.enum';
import { IUser } from '@src/modules/users/interfaces/user.interface';
import { Order } from '@src/modules/orders/entities/order.entity';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { Balance } from '@src/modules/balance/entities/balance.entity';
import { Newsletter } from '@src/modules/newsletter/entities/newsletter.entity';
import { Support } from '@src/modules/support/entities/support.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  telegramId: string;

  @Column({ type: 'float', nullable: false, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  registrationDate: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];

  @OneToMany(() => Newsletter, (newsletter) => newsletter.user)
  newsletters: Newsletter[];

  @OneToMany(() => Support, (support) => support.user)
  supportRequests: Support[];
}
