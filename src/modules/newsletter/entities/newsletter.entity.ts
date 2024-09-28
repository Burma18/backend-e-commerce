import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { NewsletterStatus } from '../enum/newsletter-status.enum';

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
    default: NewsletterStatus.CREATED,
  })
  status: NewsletterStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;
}
