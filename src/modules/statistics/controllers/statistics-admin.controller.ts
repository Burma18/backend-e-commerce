import { Get, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { UserRole } from '@src/modules/users/enums/user-role.enum';
import { StatisticsService } from '../services/statistics.service';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import {
  GetNewUsersByTimePeriodResponseDto,
  GetPurchasesTodayResponseDto,
  GetTotalPurchasesResponseDto,
  GetTotalUsersResponseDto,
} from '../dto/statistics.response.dto';

@ApiBearerAuth()
@AllowedRoles([UserRole.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'statistics', tagName: 'Statistics' })
export class AdminStatisticController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get total users' })
  @ApiResponseDecorator([
    {
      code: HttpStatus.OK,
      options: {
        type: GetTotalUsersResponseDto,
        description: 'Total number of users',
      },
    },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get('/total-users/:telegramId')
  async getTotalUsers(): Promise<GetTotalUsersResponseDto> {
    return { totalUsers: await this.statisticsService.getTotalUsers() };
  }

  @ApiOperation({ summary: 'Get total purchases' })
  @ApiResponseDecorator([
    {
      code: HttpStatus.OK,
      options: {
        type: GetTotalPurchasesResponseDto,
        description: 'Total number of purchases',
      },
    },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get('/total-purchases/:telegramId')
  async getTotalPurchases(): Promise<GetTotalPurchasesResponseDto> {
    return { totalPurchases: await this.statisticsService.getTotalPurchases() };
  }

  @ApiOperation({ summary: 'Get purchases made today' })
  @ApiResponseDecorator([
    {
      code: HttpStatus.OK,
      options: {
        type: GetPurchasesTodayResponseDto,
        description: 'Total purchases made today',
      },
    },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get('/purchases-today/:telegramId')
  async getPurchasesToday(): Promise<GetPurchasesTodayResponseDto> {
    return { purchasesToday: await this.statisticsService.getPurchasesToday() };
  }

  @ApiOperation({ summary: 'Get new users by time period' })
  @ApiResponseDecorator([
    {
      code: HttpStatus.OK,
      options: {
        type: GetNewUsersByTimePeriodResponseDto,
        description: 'Total new users for specified time period',
      },
    },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get('/new-users/:telegramId')
  async getNewUsersByTimePeriod(
    @Query('timePeriod') timePeriod: 'month' | 'week' | 'year' = 'month',
  ): Promise<GetNewUsersByTimePeriodResponseDto> {
    return {
      newUsers:
        await this.statisticsService.getNewUsersByTimePeriod(timePeriod),
    };
  }
}
