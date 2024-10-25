import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Newsletter } from '@src/modules/newsletter/entities/newsletter.entity';
import { CreateNewsletterDto } from '@src/modules/newsletter/dto/create-newsletter.dto';
import { NewsletterStatus } from '../enum/newsletter-status.enum';
import { UpdateNewsletterDto } from '../dto/update-newsletter.dto';

@Injectable()
export class NewsletterService {
  private newsletterRepository: Repository<Newsletter>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.newsletterRepository = this.entityManager.getRepository(Newsletter);
  }

  async create(dto: CreateNewsletterDto): Promise<Newsletter> {
    const newNewsletter = this.newsletterRepository.create(dto);
    return await this.newsletterRepository.save(newNewsletter);
  }

  async findAll(): Promise<Newsletter[]> {
    return await this.newsletterRepository.find();
  }

  async findById(id: number): Promise<Newsletter> {
    const newsletter = await this.newsletterRepository.findOneBy({ id });

    if (!newsletter) {
      throw new NotFoundException('Newsletter not found!');
    }

    return newsletter;
  }

  async update(id: number, dto: UpdateNewsletterDto): Promise<Newsletter> {
    const updatedNewsletterData = {
      ...dto,
      status: NewsletterStatus.EDITED,
    };

    await this.newsletterRepository.update(id, updatedNewsletterData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.newsletterRepository.delete(id);
  }
}
