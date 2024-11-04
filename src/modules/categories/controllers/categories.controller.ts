import {
  Get,
  Param,
  NotFoundException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { Category } from '@src/modules/categories/entities/category.entity';
import { ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { WebController } from '@src/common/decorators/web-controller.decorator';

@ApiBearerAuth()
@WebController({ routePrefix: 'category', tagName: 'Category' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
  ])
  @Get(':telegramId')
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get(':id/:telegramId')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoryService.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
