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
import { Newsletter } from '@src/modules/newsletter/entities/newsletter.entity';
import { Support } from '@src/modules/support/entities/support.entity';
import { Payment } from '@src/modules/crypto-pay/entities/payment.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  telegramId: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', default: '0' })
  balance: string;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  registrationDate: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Newsletter, (newsletter) => newsletter.user)
  newsletters: Newsletter[];

  @OneToMany(() => Support, (support) => support.user)
  supportRequests: Support[];
}
