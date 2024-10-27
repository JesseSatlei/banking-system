import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { AccountResponseDto } from './dto/account-response.dto';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository
  ) {}

  async createOrUpdateAccount(accountNumber: number, balance: number): Promise<Account> {
    let account;
    try {
      account = await this.accountRepository.findByAccountNumber(accountNumber);
      if (!account) {
        account = this.accountRepository.createAccount({ accountNumber, balance });
        this.logger.log(`Creating new account: ${accountNumber}`);
        return account;
      }
      return account;
    } catch (error) {
      this.logger.error(`Error creating/updating account ${accountNumber}: ${error.message}`);
      throw error;
    }
  }

  async getAccountDetails(accountNumber: number): Promise<AccountResponseDto> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');
    return { accountNumber: account.accountNumber, balance: account.balance };
  }

  async getAllAccounts(): Promise<AccountResponseDto[]> {
    const accounts = await this.accountRepository.find();
    return accounts.map((account) => ({
      accountNumber: account.accountNumber,
      balance: account.balance,
    }));
  }

  async deleteAccount(accountNumber: number): Promise<void> {
    const result = await this.accountRepository.delete({ accountNumber });
    if (result.affected === 0) throw new NotFoundException('Account not found');
  }

  async updateBalance(accountNumber: number, amount: number): Promise<void> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');
    await this.accountRepository.updateBalance(accountNumber, amount);
  }
}
