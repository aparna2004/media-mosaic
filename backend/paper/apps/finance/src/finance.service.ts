import { FinanceTicker, NewsItem } from '@app/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tickerFallback } from './data/tickerFallback';
import * as xml2js from 'xml2js';
import axios from 'axios';
import { currency } from './data/currency';
import { finance } from './data/finance';

@Injectable()
export class FinanceService {
  private readonly API_URL: string;
  private readonly logger = new Logger(FinanceService.name);
  private readonly NEWS_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('TICKERS_URL') ?? '';
    this.NEWS_URL = this.configService.get<string>('FINANCE_URL') ?? '';
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
    let topGainers: FinanceTicker[] = data.top_gainers
      .slice(0, 3)
      .map((item) => {
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

  async getFinance(): Promise<NewsItem[]> {
    try {
      const response = await axios.get(this.NEWS_URL);
      return this.parseRssToNewsItems(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch Hindu news: ${error.message}`);
      return this.parseRssToNewsItems(finance);
    }
  }

  private async parseRssToNewsItems(rssData: string): Promise<NewsItem[]> {
    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true,
      });

      const result = await parser.parseStringPromise(rssData);
      const items = result.rss.channel.item;

      return items.map((item: any) => ({
        id: this.extractId(item.guid._ || item.link),
        title: this.cleanContent(item.title),
        description: this.cleanContent(item.description),
        url: this.cleanContent(item.link),
        author: 'The Hindu',
        image: this.extractImage(item['media:content']),
        language: 'en',
        category: this.extractCategories(item),
        published: new Date(item.pubDate).toISOString(),
      }));
    } catch (error) {
      this.logger.error(`Failed to parse RSS: ${error.message}`);
      return [];
    }
  }

  private cleanContent(content: string): string {
    if (!content) return '';
    return content
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private extractId(guid: string): string {
    if (!guid) return '';
    const match = guid.match(/article-(\d+)/);
    return match ? match[1] : guid;
  }

  private extractImage(media: any): string {
    if (!media) return '';
    return media.url || '';
  }

  private extractCategories(item: any): string[] {
    const categories = ['hindu'];

    if (item.category) {
      if (Array.isArray(item.category)) {
        categories.push(...item.category.map((c) => this.cleanContent(c)));
      } else {
        categories.push(this.cleanContent(item.category));
      }
    }

    // Extract additional category from URL if available
    if (item.link) {
      const urlParts = item.link.split('/');
      const newsType = urlParts[4];
      if (newsType && !categories.includes(newsType)) {
        categories.push(newsType);
      }
    }

    return categories.filter(Boolean);
  }
}
