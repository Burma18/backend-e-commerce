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
} from '@nestjs/common';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { Product } from '../entities/product.entity';

@ApiBearerAuth()
@AdminController({ routePrefix: 'product', tagName: 'Product' })
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

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
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
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
  async delete(@Param('id') id: number) {
    await this.productService.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
