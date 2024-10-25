import {
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateNewsletterDto } from '../dto/create-newsletter.dto';
import { NewsletterService } from '../services/newsletter.service';
import { Newsletter } from '../entities/newsletter.entity';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

@ApiBearerAuth()
@AllowedRoles([UserRole.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'newsletter', tagName: 'Newsletter' })
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @ApiOperation({ summary: 'Create a new newsletter' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Newsletter } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
  ])
  @Post(':telegramId')
  async create(
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter> {
    return await this.newsletterService.create(createNewsletterDto);
  }

  @ApiOperation({ summary: 'Get all newsletters' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Newsletter } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get(':telegramId')
  async findAll(): Promise<Newsletter[]> {
    return await this.newsletterService.findAll();
  }

  @ApiOperation({ summary: 'Get a newsletter by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Newsletter } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Get(':id/:telegramId')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Newsletter | null> {
    return await this.newsletterService.findById(id);
  }

  @ApiOperation({ summary: 'Update a newsletter by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Newsletter } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Put(':id/:telegramId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter | null> {
    return await this.newsletterService.update(id, createNewsletterDto);
  }

  @ApiOperation({ summary: 'Delete a newsletter by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Newsletter } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Delete(':id/:telegramId')
  async delete(@Param('id') id: number): Promise<void> {
    await this.newsletterService.delete(id);
  }
}
