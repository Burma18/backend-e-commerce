import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Support } from '@src/modules/support/entities/support.entity';
import { CreateSupportDto } from '@src/modules/support/dto/create-support.dto';
import { UpdateSupportDto } from '@src/modules/support/dto/update-support.dto';

@Injectable()
export class SupportService {
  private repository: Repository<Support>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Support);
  }

  async findAll(): Promise<Support[]> {
    return this.repository.find();
  }

  async findOneBy(options: FindOptionsWhere<Support>): Promise<Support> {
    const support = await this.repository.findOneBy(options);

    if (!support) {
      throw new NotFoundException('Support request not found!');
    }

    return support;
  }

  async create(createSupportDto: CreateSupportDto): Promise<Support> {
    const supportRequest = this.repository.create(createSupportDto);
    return await this.repository.save(supportRequest);
  }

  async update(
    id: number,
    updateSupportDto: UpdateSupportDto,
  ): Promise<Support> {
    await this.repository.update(id, updateSupportDto);
    return this.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
