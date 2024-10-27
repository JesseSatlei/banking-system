import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: number;

  @ApiProperty({ description: 'Current balance' })
  balance: number;
}
