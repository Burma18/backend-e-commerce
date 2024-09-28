import { ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '@src/modules/products/services/product.service';
import { Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { Product } from '../entities/product.entity';

@ApiBearerAuth()
@WebController({ routePrefix: 'product', tagName: 'Product' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
  ])
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve product by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Product } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @ApiParam({ name: 'id', description: 'The ID of the product', example: 1 })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }
}
