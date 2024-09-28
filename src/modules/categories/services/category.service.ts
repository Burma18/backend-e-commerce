import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
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

  async findOneBy(options: FindOptionsWhere<Category>): Promise<Category> {
    const category = await this.repository.findOneBy(options);

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.repository.create(createCategoryDto);
    return this.repository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneBy({ id });

    Object.assign(category, updateCategoryDto);
    return this.repository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
