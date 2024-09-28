import { Get, Param, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { Balance } from '../entities/balance.entity';
import { AddBalanceDto } from '../dto/add-balance.dto';
import { BalanceService } from '../services/balance.services';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { Roles } from '@src/common/enums/roles.enum';

@ApiBearerAuth()
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'balance', tagName: 'Balance' })
export class BalanceAdminController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user balance by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Number } },
    HttpStatus.NOT_FOUND,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({ name: 'userId', example: 1, description: 'User ID' })
  async getUserBalance(@Param('userId') userId: number) {
    return await this.balanceService.getUserBalance(userId);
  }

  @Get(':userId/history')
  @ApiOperation({ summary: 'Get balance history of a user by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Balance, isArray: true } },
    HttpStatus.NOT_FOUND,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({ name: 'userId', example: 1, description: 'User ID' })
  async getUserBalanceHistory(@Param('userId') userId: number) {
    return await this.balanceService.getBalanceHistory(userId);
  }

  @Post(':userId/add')
  @ApiOperation({ summary: 'Add balance to a user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Number } },
    HttpStatus.NOT_FOUND,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
  ])
  @ApiParam({ name: 'userId', example: 1, description: 'User ID' })
  async addUserBalance(
    @Param('userId') userId: number,
    @Body() addBalanceDto: AddBalanceDto,
  ) {
    return await this.balanceService.addUserBalance(
      userId,
      addBalanceDto.amount,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get all balance transactions history' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Balance, isArray: true } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  async getAllBalanceHistory() {
    return await this.balanceService.getAllBalanceHistory();
  }
}
