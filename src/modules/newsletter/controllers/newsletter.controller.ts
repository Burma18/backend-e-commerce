import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNewsletterDto } from '../dto/create-newsletter.dto';
import { NewsletterService } from '../services/newsletter.service';
import { Newsletter } from '../entities/newsletter.entity';
import { AdminGuard } from '@src/modules/auth/guards/admin-guard';

@ApiTags('Newsletters')
@Controller('newsletters')
@UseGuards(AdminGuard)
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @ApiOperation({ summary: 'Create a new newsletter' })
  @ApiResponse({
    status: 201,
    description: 'Newsletter created successfully',
    type: Newsletter,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  async create(
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter> {
    return await this.newsletterService.create(createNewsletterDto);
  }

  @ApiOperation({ summary: 'Get all newsletters' })
  @ApiResponse({
    status: 200,
    description: 'List of all newsletters',
    type: [Newsletter],
  })
  @Get()
  async findAll(): Promise<Newsletter[]> {
    return await this.newsletterService.findAll();
  }

  @ApiOperation({ summary: 'Get a newsletter by ID' })
  @ApiResponse({
    status: 200,
    description: 'Newsletter details',
    type: Newsletter,
  })
  @ApiResponse({ status: 404, description: 'Newsletter not found' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Newsletter | null> {
    return await this.newsletterService.findById(id);
  }

  @ApiOperation({ summary: 'Update a newsletter by ID' })
  @ApiResponse({
    status: 200,
    description: 'Newsletter updated successfully',
    type: Newsletter,
  })
  @ApiResponse({ status: 404, description: 'Newsletter not found' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter | null> {
    return await this.newsletterService.update(id, createNewsletterDto);
  }

  @ApiOperation({ summary: 'Delete a newsletter by ID' })
  @ApiResponse({ status: 200, description: 'Newsletter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Newsletter not found' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.newsletterService.delete(id);
  }
}
