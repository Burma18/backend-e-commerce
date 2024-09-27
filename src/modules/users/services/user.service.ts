import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Between, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { plainToInstance } from 'class-transformer';

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

  async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    const user = await this.repository.findOneBy(options);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.repository.findOne({ where: { telegramId } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.repository.update(id, updateUserDto);
    return this.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getStatistics() {
    const totalUsers = await this.countUsers();
    const totalPurchases = await this.countPurchasesToday();
    return { totalUsers, totalPurchases };
  }

  private async countUsers(): Promise<number> {
    return await this.repository.count();
  }

  private async countPurchasesToday(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.paymentRepository.count({
      where: {
        paymentDate: Between(startOfDay, endOfDay),
      },
    });
  }

  async updateMe(id: number, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOneBy({ id });

    await this.repository.update({ id }, dto);

    return plainToInstance(User, {
      ...existingUser,
      ...dto,
    });
  }

  async getMe(id: number): Promise<User> {
    return this.findOneBy({ id });
  }
}
