import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from '@src/modules/orders/services/order.service';
import { Order } from '@src/modules/orders/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { GetJwtPayload } from '@src/common/decorators/get-jwt-payload.decorator';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import {
  MakePurchaseDto,
  MakePurchaseResponse,
} from '../dto/make-purchase.dto';

@ApiBearerAuth()
@WebController({ routePrefix: 'order', tagName: 'Order' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all orders for user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
  ])
  @Get()
  async getAllOrders(@GetJwtPayload() user: IJwtPayload): Promise<Order[]> {
    return await this.orderService.findAllByUser(user.id);
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get(':id')
  async getOrderById(
    @Param('id', ParseIntPipe) orderId: number,
  ): Promise<Order> {
    return await this.orderService.findOne(orderId);
  }

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
  ])
  @Post()
  async createOrder(
    @GetJwtPayload() user: IJwtPayload,
    @Body() createOrderDto: CreateOrderDto,
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
  @Delete(':id')
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    return await this.orderService.delete(orderId);
  }

  @ApiOperation({ summary: 'Make a purchase' })
  @ApiBody({ type: MakePurchaseDto })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Order } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
  ])
  @Post('purchase')
  async makePurchase(
    @GetJwtPayload() user: IJwtPayload,
    @Body() makePurchaseDto: MakePurchaseDto,
  ): Promise<MakePurchaseResponse> {
    return await this.orderService.makePurchase(
      user.id,
      makePurchaseDto.orderId,
    );
  }
}
