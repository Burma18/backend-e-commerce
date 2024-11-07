import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from '@src/modules/orders/services/order.service';
import { Order } from '@src/modules/orders/entities/order.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { GetJwtPayload } from '@src/common/decorators/get-jwt-payload.decorator';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import {
  MakePurchaseDto,
  MakePurchaseOverallResponse,
} from '../dto/make-purchase.dto';
import { OrderStatus } from '../enums/order.status.enum';
import { GetAllOrdersPriceResponseDto } from '../dto/get-total-price-all-orders.dto';
import { OrderItemDto } from '../dto/order-item.dto';

@ApiBearerAuth()
@WebController({ routePrefix: 'order', tagName: 'Order' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all orders for user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
  ])
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter orders by status',
  })
  @Get(':telegramId')
  async getAllOrders(
    @GetJwtPayload() user: IJwtPayload,
    @Query('status') status?: OrderStatus,
  ): Promise<Order[]> {
    return await this.orderService.findAllByUser(user.id, status);
  }

  @ApiOperation({ summary: 'Get all orders price for user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: GetAllOrdersPriceResponseDto } },
    HttpStatus.UNAUTHORIZED,
  ])
  @Get('price/:telegramId')
  async getPriceOfAllOrders(
    @GetJwtPayload() user: IJwtPayload,
  ): Promise<GetAllOrdersPriceResponseDto> {
    return await this.orderService.calculateTotalPriceOfOrders(user.id);
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get(':id/:telegramId')
  async getOrderById(
    @Param('id', ParseIntPipe) orderId: number,
  ): Promise<Order> {
    return await this.orderService.findOne(orderId);
  }

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: OrderItemDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
  ])
  @Post()
  async createOrder(
    @GetJwtPayload() user: IJwtPayload,
    @Body() createOrderDto: OrderItemDto,
  ): Promise<Order> {
    return await this.orderService.create(user.id, createOrderDto);
  }

  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Put(':id')
  async updateOrder(
    @GetJwtPayload() user: IJwtPayload,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.orderService.update(orderId, updateOrderDto, user.id);
  }

  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Delete(':id/:telegramId')
  async deleteOrder(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.orderService.delete(id);
  }

  @ApiOperation({ summary: 'Make a purchase' })
  @ApiBody({ type: MakePurchaseDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: MakePurchaseOverallResponse } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
  ])
  @Post('purchaseAll')
  async makePurchaseAll(
    @GetJwtPayload() user: IJwtPayload,
  ): Promise<MakePurchaseOverallResponse> {
    return await this.orderService.makePurchaseAllOrders(user.id);
  }

  @ApiOperation({ summary: 'Make a purchase' })
  @ApiBody({ type: MakePurchaseDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: MakePurchaseOverallResponse } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
  ])
  @Post('purchase')
  async makePurchase(
    @GetJwtPayload() user: IJwtPayload,
    @Body() makePurchaseDto: MakePurchaseDto,
  ): Promise<MakePurchaseOverallResponse> {
    return await this.orderService.makePurchase(
      user.id,
      makePurchaseDto.orderIds,
    );
  }
}
