import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

export class TransactionRepository extends Repository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {
    super(
      transactionRepository.target,
      transactionRepository.manager,
      transactionRepository.queryRunner,
    );
  }

  async createTransaction(transactionDto: TransactionRequestDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionDto);
    return this.save(transaction);
  }
}
