import { ApiProperty } from '@nestjs/swagger';

export class AccountRequestDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: number;

  @ApiProperty({ description: 'Initial account balance' })
  balance: number;
}
