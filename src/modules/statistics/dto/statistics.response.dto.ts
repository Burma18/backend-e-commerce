import { ApiProperty } from '@nestjs/swagger';

export class GetTotalUsersResponseDto {
  @ApiProperty({ description: 'Total number of users', example: 1234 })
  totalUsers: number;
}

export class GetTotalPurchasesResponseDto {
  @ApiProperty({ description: 'Total number of purchases', example: 567 })
  totalPurchases: number;
}

export class GetPurchasesTodayResponseDto {
  @ApiProperty({ description: 'Total purchases made today', example: 45 })
  purchasesToday: number;
}

export class GetNewUsersByTimePeriodResponseDto {
  @ApiProperty({
    description: 'Total new users within the specified time period',
    example: 98,
  })
  newUsers: number;
}
