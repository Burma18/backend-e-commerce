import { Get, Delete, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '@src/modules/payments/services/payment.service';
import { Payment } from '@src/modules/payments/entities/payment.entity';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'payment', tagName: 'Payment' })
export class PaymentAdminController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Payment } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @ApiOperation({ summary: 'Delete a payment by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Payment } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Delete(':id')
  async deletePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.delete(id);
  }
}
