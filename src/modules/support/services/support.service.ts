import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Support } from '@src/modules/support/entities/support.entity';

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
}
