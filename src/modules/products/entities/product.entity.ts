import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  credentials: Record<string, any>[];

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @DeleteDateColumn()
  deletedAt?: Date;
}
