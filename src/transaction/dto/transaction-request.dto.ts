import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { TransactionType } from './transaction-type.enum'; // Ajuste o caminho conforme necessário

export class TransactionRequestDto {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  @ApiProperty({ description: 'Type of transaction' })
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Origin account number (for transfer)', required: false })
  originAccount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Destination account number (for transfer)', required: false })
  destinationAccount?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Amount of money for the transaction' })
  amount: number;
}
