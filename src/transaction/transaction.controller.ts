import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { AccountRequestDto } from '../account/dto/account-request.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('batch')
  @ApiOperation({ summary: 'Process a batch of accounts and transactions independently' })
  async processBatch(
    @Body() data: { accounts: AccountRequestDto[]; transactions: TransactionRequestDto[] }
  ): Promise<{ processedAccounts: any[]; processedTransactions: Transaction[]; errors: any }> {
    return this.transactionService.processBatch(data.accounts, data.transactions);
  }
}
