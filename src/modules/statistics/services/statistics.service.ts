import { Injectable } from '@nestjs/common';
import { Between, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { Payment } from '@src/modules/crypto-pay/entities/payment.entity';

@Injectable()
export class StatisticsService {
  private userRepository: Repository<User>;
  private paymentRepository: Repository<Payment>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    (this.userRepository = this.entityManager.getRepository(User)),
      (this.paymentRepository = this.entityManager.getRepository(Payment));
  }

  async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async getTotalPurchases(): Promise<number> {
    return await this.paymentRepository.count();
  }

  async getPurchasesToday(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.paymentRepository.count({
      where: {
        paymentDate: Between(startOfDay, endOfDay),
      },
    });
  }

  async getNewUsersByTimePeriod(
    timePeriod: 'month' | 'week' | 'year',
  ): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (timePeriod) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        throw new Error('Invalid time period');
    }

    return await this.userRepository.count({
      where: {
        registrationDate: Between(startDate, new Date()),
      },
    });
  }
}
