import { Get, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { GetJwtPayload } from '@src/common/decorators/get-jwt-payload.decorator';
import { AddBalanceDto } from '../dto/add-balance.dto';
import { BalanceService } from '../services/balance.services';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { GetUserBalanceResponse } from '../rto/get-user-balance.rto';
import { GetBalanceHistoryResponse } from '../rto/get-balance-history.rto';
import { AddUserBalanceResponse } from '../rto/add-user-balance.rto';

@ApiBearerAuth()
@WebController({ routePrefix: 'balance', tagName: 'Balance' })
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('current')
  @ApiOperation({ summary: 'Retrieve current balance of the logged-in user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: GetUserBalanceResponse } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  async getCurrentBalance(
    @GetJwtPayload() user: IJwtPayload,
  ): Promise<GetUserBalanceResponse> {
    return await this.balanceService.getUserBalance(user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Retrieve balance history of the logged-in user' })
  @ApiResponseDecorator([
    {
      code: HttpStatus.OK,
      options: { type: GetBalanceHistoryResponse, isArray: true },
    },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  async getBalanceHistory(
    @GetJwtPayload() user: IJwtPayload,
  ): Promise<GetBalanceHistoryResponse> {
    return await this.balanceService.getBalanceHistory(user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add balance for the logged-in user' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: AddUserBalanceResponse } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
  ])
  async addBalance(
    @GetJwtPayload() user: IJwtPayload,
    @Body() addBalanceDto: AddBalanceDto,
  ): Promise<AddUserBalanceResponse> {
    return await this.balanceService.addUserBalance(
      user.id,
      addBalanceDto.amount,
    );
  }
}
