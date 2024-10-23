import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ type: 'varchar', nullable: true })
  invoiceId: number;

  @Column({ type: 'varchar', nullable: true })
  paymentUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentConfirmedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  currencyType: string;

  @Column({ type: 'varchar', nullable: true })
  paidAsset: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  feeAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  paidAmount: number;
}
