import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '@src/modules/products/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

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
    const newProduct = this.repository.create(dto);
    return await this.repository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (product) {
      Object.assign(product, dto);
      return await this.repository.save(product);
    }
    return undefined;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
