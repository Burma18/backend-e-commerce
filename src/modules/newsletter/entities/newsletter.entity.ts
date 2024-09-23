import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';

export enum NewsletterStatus {
  SENT = 'SENT',
  CANCELED = 'CANCELED',
}

@Entity()
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.newsletters)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NewsletterStatus,
  })
  status: NewsletterStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;
}
