import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRequestDto } from './dto/account-request.dto';

export class AccountRepository extends Repository<Account> {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {
    super(
      accountRepository.target,
      accountRepository.manager,
      accountRepository.queryRunner,
    );
  }

  async createAccount(accountRequestDto: AccountRequestDto): Promise<Account> {
    const account = this.accountRepository.create(accountRequestDto);
    return this.save(account);
  }

  async findByAccountNumber(accountNumber: number): Promise<Account | null> {
    return this.findOne({ where: { accountNumber } });
  }

  async updateBalance(accountNumber: number, amount: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Account)
      .set({ balance: () => `balance + ${amount}` })
      .where("accountNumber = :accountNumber", { accountNumber })
      .execute();
  }
}
