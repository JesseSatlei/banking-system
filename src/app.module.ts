import { ConfigModule } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { connectToDatabase, databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await connectToDatabase();
  }
}