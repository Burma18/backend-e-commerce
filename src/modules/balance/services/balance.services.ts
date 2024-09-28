import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { Balance } from '../entities/balance.entity';

@Injectable()
export class BalanceService {
  private repository: Repository<Balance>;
  private userRepository: Repository<User>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Balance);
    this.userRepository = this.entityManager.getRepository(User);
  }

  async getUserBalance(userId: number): Promise<{ balance: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['balances'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.balance };
  }

  async addUserBalance(
    userId: number,
    amount: number,
  ): Promise<{ balance: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newBalance = this.repository.create({ user, amount });
    await this.repository.save(newBalance);

    user.balance += amount;
    await this.userRepository.save(user);

    return { balance: user.balance };
  }

  async getBalanceHistory(
    userId: number,
  ): Promise<{ balanceHistory: Balance[] }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['balances'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const balanceHistory = await this.repository.find({
      where: { user: { id: userId } },
      order: { addedAt: 'DESC' },
    });

    if (!balanceHistory.length) {
      throw new NotFoundException('No balance history found for this user');
    }

    return { balanceHistory };
  }

  async getAllBalanceHistory(): Promise<{ balanceHistory: Balance[] }> {
    const balanceHistory = await this.repository.find({
      order: { addedAt: 'DESC' },
      relations: ['user'],
    });

    return { balanceHistory };
  }
}
