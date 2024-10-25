import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from '@src/modules/products/services/product.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import {
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { Product } from '../entities/product.entity';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

@ApiBearerAuth()
@AdminController({ routePrefix: 'product', tagName: 'Product' })
@AllowedRoles([UserRole.ADMIN])
@UseGuards(RolesGuard)
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Get(':telegramId')
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  async findAll() {
    return await this.productService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @ApiBody({ type: CreateProductDto })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Get(':id/:telegramId')
  @ApiOperation({ summary: 'Retrieve product by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({ name: 'id', description: 'The ID of the product', example: 1 })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    example: 1,
  })
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id/:telegramId')
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    example: 1,
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
