import {
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from '@src/modules/orders/services/order.service';
import { Order } from '@src/modules/orders/entities/order.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';

@ApiBearerAuth()
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'order', tagName: 'Order' })
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @Get(':id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order | null> {
    return this.orderService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @Put(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    return this.orderService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.orderService.delete(id);
  }
}
