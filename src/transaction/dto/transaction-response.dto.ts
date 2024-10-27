import { TransactionRequestDto } from "./transaction-request.dto";

export class TransactionResponseDto {
  transaction: TransactionRequestDto;
  status: string;
  result?: any;
  error?: string;
}