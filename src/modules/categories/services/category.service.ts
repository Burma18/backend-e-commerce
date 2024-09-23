import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '@src/modules/categories/entities/category.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  private repository: Repository<Category>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Category);
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find();
  }
}
