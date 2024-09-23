import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateNewsletterDto } from '../dto/create-newsletter.dto';
import { NewsletterService } from '../services/newsletter.service';
import { Newsletter } from '../entities/newsletter.entity';

@Controller('newsletters')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  async create(
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter> {
    return await this.newsletterService.create(createNewsletterDto);
  }

  @Get()
  async findAll(): Promise<Newsletter[]> {
    return await this.newsletterService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Newsletter | null> {
    return await this.newsletterService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter | null> {
    return await this.newsletterService.update(id, createNewsletterDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.newsletterService.delete(id);
  }
}
