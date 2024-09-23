import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { Payment } from '@src/modules/payments/entities/payment.entity';

@Injectable()
export class UserService {
  private repository: Repository<User>;
  private paymentRepository: Repository<Payment>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(User);
    this.paymentRepository = this.entityManager.getRepository(Payment);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.repository.findOne({ where: { telegramId } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.repository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async countUsers(): Promise<number> {
    return await this.repository.count();
  }

  async countPurchasesToday(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.paymentRepository.count({
      where: {
        paymentDate: Between(startOfDay, endOfDay),
      },
    });
  }
}
