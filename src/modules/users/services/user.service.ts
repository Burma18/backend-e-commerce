import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private repository: Repository<User>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(User);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const telegramIdParsed = createUserDto.telegramId.toString();

    const updatedDto = {
      ...createUserDto,
      telegramId: telegramIdParsed,
    } as Omit<CreateUserDto, 'telegramId'>;

    const user = this.repository.create(updatedDto);
    return this.repository.save(user);
  }

  async findAll(filter?: { receiveNewsletter?: boolean }): Promise<User[]> {
    const query = this.repository.createQueryBuilder('user');

    if (filter && typeof filter.receiveNewsletter === 'boolean') {
      query.where('user.receiveNewsletter = :receiveNewsletter', {
        receiveNewsletter: filter.receiveNewsletter,
      });
    }

    return query.getMany();
  }

  async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    const user = await this.repository.findOneBy(options);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findByTelegramId(telegramId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { telegramId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async update(dto: UpdateUserDto): Promise<User> {
    const updatedDto = { ...dto } as Omit<UpdateUserDto, 'telegramId'>;

    await this.repository.update(
      { telegramId: dto.telegramId.toString() },
      updatedDto,
    );

    return this.findOneBy({ telegramId: dto.telegramId.toString() });
  }

  async remove(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async updateMe(id: number, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOneBy({ id });

    const updatedDto = { ...dto } as Omit<UpdateUserDto, 'telegramId'>;

    await this.repository.update({ id }, updatedDto);

    return plainToInstance(User, {
      ...existingUser,
      ...updatedDto,
    });
  }

  async getMe(id: number): Promise<User> {
    return this.findOneBy({ id });
  }

  async getUserBalance(id: number): Promise<{ balance: string }> {
    const user = await this.findOneBy({ id });

    return { balance: user.balance };
  }

  async addUserBalance(
    id: number,
    amount: number,
  ): Promise<{ balance: string }> {
    const user = await this.findOneBy({ id });

    const currentBalance = parseFloat(user.balance);

    const newBalance = currentBalance + amount;

    user.balance = newBalance.toFixed(2);

    await this.repository.save(user);

    return { balance: user.balance };
  }
}
