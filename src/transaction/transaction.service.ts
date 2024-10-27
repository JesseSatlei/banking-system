import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { AccountResponseDto } from '../account/dto/account-response.dto';
import { TransactionType } from './dto/transaction-type.enum';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly accountService: AccountService,
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository
  ) {}

  async processBatch(
    accounts: { accountNumber: number; balance: number }[],
    transactions: TransactionRequestDto[]
  ): Promise<{
    processedAccounts: AccountResponseDto[];
    processedTransactions: Transaction[];
    errors: { accountNumber: number; error: string }[];
  }> {
    const processedAccounts: AccountResponseDto[] = [];
    const processedTransactions: Transaction[] = [];
    const errors: { accountNumber: number; error: string }[] = [];

    for (const accountDto of accounts) {
      try {
        const account = await this.accountService.createOrUpdateAccount(accountDto.accountNumber, accountDto.balance);
        processedAccounts.push(account);
        this.logger.log(`Processed account: ${accountDto.accountNumber}`);
      } catch (error) {
        errors.push({ accountNumber: accountDto.accountNumber, error: error.message });
        this.logger.error(`Failed to process account ${accountDto.accountNumber}: ${error.message}`);
      }
    }

    for (const transaction of transactions) {
      try {
        if (transaction.type === TransactionType.TRANSFER) {
          await this.accountService.updateBalance(transaction.originAccount, -transaction.amount);
          await this.accountService.updateBalance(transaction.destinationAccount!, transaction.amount);
          this.logger.log(`Processed transfer from ${transaction.originAccount} to ${transaction.destinationAccount}`);
        } else if (transaction.type === TransactionType.WITHDRAW) {
          await this.accountService.updateBalance(transaction.originAccount, -transaction.amount);
          this.logger.log(`Processed withdrawal from account ${transaction.originAccount}`);
        } else if (transaction.type === TransactionType.DEPOSIT) {
          await this.accountService.updateBalance(transaction.originAccount, transaction.amount);
          this.logger.log(`Processed deposit to account ${transaction.originAccount}`);
        }

        this.logger.log(`Creating transaction: ${JSON.stringify(transaction)}`);
        const savedTransaction = await this.transactionRepository.createTransaction({
          ...transaction,
          destinationAccount: transaction.type === TransactionType.TRANSFER ? transaction.destinationAccount : null,
        });

        processedTransactions.push(savedTransaction);
        this.logger.log(`Saved transaction: ${JSON.stringify(savedTransaction)}`);
      } catch (error) {
        errors.push({ accountNumber: transaction.originAccount, error: error.message });
        this.logger.error(`Failed to process transaction for account ${transaction.originAccount}: ${error.message}`);
      }
    }

    return { processedAccounts, processedTransactions, errors };
  }
}
