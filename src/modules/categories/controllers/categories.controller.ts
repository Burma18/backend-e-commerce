import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '@src/modules/categories/entities/category.entity';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

@ApiBearerAuth()
@AllowedRoles([UserRole.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'category', tagName: 'Category' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
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
    HttpStatus.FORBIDDEN,
  ])
  @Get(':id/:telegramId')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoryService.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Post(':telegramId')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Put(':id/:telegramId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryService.update(id, updateCategoryDto);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Category } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/:telegramId')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const category = await this.categoryService.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryService.delete(id);
  }
}
