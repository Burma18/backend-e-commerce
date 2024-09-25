import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '@src/modules/categories/entities/category.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

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

  async findOne(id: number): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.repository.create(createCategoryDto);
    return this.repository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    const category = await this.findOne(id);
    if (!category) {
      return null;
    }
    Object.assign(category, updateCategoryDto);
    return this.repository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
