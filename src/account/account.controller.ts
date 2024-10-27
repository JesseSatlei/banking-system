// src/account/account.controller.ts
import { Controller, Get, Post, Delete, Param, Body, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResponseDto } from './dto/account-response.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AccountRequestDto } from './dto/account-request.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update an account' })
  @ApiResponse({ status: 201, description: 'Account created/updated successfully.' })
  async createOrUpdateAccount(@Body() accountRequestDto: AccountRequestDto): Promise<AccountResponseDto> {
    return this.accountService.createOrUpdateAccount(accountRequestDto.accountNumber, accountRequestDto.balance);
  }

  @Get(':accountNumber')
  @ApiOperation({ summary: 'Get account details' })
  @ApiResponse({ status: 200, description: 'Returns account details.' })
  async getAccount(@Param('accountNumber') accountNumber: number): Promise<AccountResponseDto> {
    return this.accountService.getAccountDetails(accountNumber);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Returns all accounts.' })
  async getAllAccounts(): Promise<AccountResponseDto[]> {
    return this.accountService.getAllAccounts();
  }

  @Delete(':accountNumber')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully.' })
  async deleteAccount(@Param('accountNumber') accountNumber: number): Promise<{ status: string }> {
    await this.accountService.deleteAccount(accountNumber);
    return { status: 'deleted' };
  }
}
