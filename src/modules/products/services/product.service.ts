import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '@src/modules/products/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Category } from '@src/modules/categories/entities/category.entity';

@Injectable()
export class ProductService {
  private repository: Repository<Product>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.repository = this.entityManager.getRepository(Product);
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const newProduct = this.repository.create({
      ...dto,
      categoryId: dto.categoryId,
    });

    return await this.repository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find({ relations: ['category'] });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return product;
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (product) {
      Object.assign(product, dto);

      if (dto.categoryId) {
        const category = await this.entityManager.findOne(Category, {
          where: { id: dto.categoryId },
        });
        if (category) {
          product.category = category;
        } else {
          throw new NotFoundException('Category not found!');
        }
      }

      await this.repository.save(product);

      return this.findById(id);
    }
    return undefined;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
