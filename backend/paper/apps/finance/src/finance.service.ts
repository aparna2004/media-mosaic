import { FinanceTicker } from '@app/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tickerFallback } from './data/tickerFallback';
import axios from 'axios';
import { currency } from './data/currency';
@Injectable()
export class FinanceService {
  private readonly API_URL: string;
  private readonly logger = new Logger(FinanceService.name);

  constructor(private configService: ConfigService) {
    this.API_URL = this.configService.get<string>('TICKERS_URL') || '';
  }

  async getFinanceTickers(): Promise<FinanceTicker[]> {
    try {
      const response = await axios.get(this.API_URL);
      if (response.status !== 200) {
        throw new Error(`API response status: ${response.status}`);
      }
      return this.processTickerResponse(response.data);
    } catch (error) {
      this.logger.warn(
        `API call failed: ${error.message}. Using fallback data.`,
      );
      return this.processTickerResponse(tickerFallback);
    }
  }

  processTickerResponse(data: any): FinanceTicker[] {
    let topGainers: FinanceTicker[] = data.top_gainers.slice(0, 3).map((item) => {
      return {
        ticker: item.ticker,
        price: item.price,
        change_percentage: item.change_percentage,
        type: 'gainer',
      };
    });
    let topLosers: FinanceTicker[] = data.top_losers.slice(0, 3).map((item) => {
      return {
        ticker: item.ticker,
        price: item.price,
        change_percentage: item.change_percentage,
        type: 'loser',
      };
    });
    return [...topGainers, ...topLosers];
  }

  getCurrency() {
    return currency;
  }
}
