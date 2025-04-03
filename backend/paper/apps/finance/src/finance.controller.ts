import { Controller } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { MessagePattern } from '@nestjs/microservices';
import { FinanceTicker, Message } from '@app/types';

@Controller()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @MessagePattern(Message.GET_TICKERS)
  async getFinanceTickers(data: {}): Promise<FinanceTicker[]> {
    return this.financeService.getFinanceTickers();
  }
  @MessagePattern(Message.GET_CURRENCY)
  async getCurrency(data: {}): Promise<FinanceTicker[]> {
    return this.financeService.getCurrency();
  }
}
