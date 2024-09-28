import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsPositive, Min } from 'class-validator';

export class AddBalanceDto {
  @ApiProperty()
  @IsDecimal()
  @IsPositive()
  @Min(0)
  amount: number;
}
