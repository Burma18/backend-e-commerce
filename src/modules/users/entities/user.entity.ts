import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@src/modules/users/enums/user-role.enum';
import { IUser } from '@src/modules/users/interfaces/user.interface';

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
}
