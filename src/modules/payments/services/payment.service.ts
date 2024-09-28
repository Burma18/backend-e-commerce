import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from '@src/modules/payments/entities/payment.entity';

@Injectable()
export class PaymentService {
  private repository: Repository<Payment>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.repository.find();
  }
  async findOneBy(id: number): Promise<Payment> {
    const payment = await this.repository.findOneBy({ id });

    if (!payment) {
      throw new NotFoundException('Payment not found!');
    }

    return payment;
  }

  async create(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = this.repository.create(payment);
    return this.repository.save(newPayment);
  }

  async update(id: number, updateData: Partial<Payment>): Promise<Payment> {
    await this.repository.update(id, updateData);
    return this.findOneBy(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
