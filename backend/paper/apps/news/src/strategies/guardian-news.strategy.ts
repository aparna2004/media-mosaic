import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { gurardianNewsFallback } from '../data/guardianNewsFallback';

@Injectable()
export class GuardianNewsStrategy implements NewsStrategy {
  private readonly logger = new Logger(GuardianNewsStrategy.name);
  private readonly API_URL: string;
  private readonly API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('GUARDIAN_URL') ?? '';
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get<string>(this.API_URL);
      return this.parseRssToNewsItems(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch Guardian news: ${error.message}`);
      return this.parseRssToNewsItems(gurardianNewsFallback);
    }
  }
  private async parseRssToNewsItems(xmlData: string): Promise<NewsItem[]> {
    try {
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xmlData);

      const items = Array.isArray(result.rss.channel.item)
        ? result.rss.channel.item
        : [result.rss.channel.item];

      return items.map((item: any) => ({
        id: item.guid,
        title: item.title,
        description: this.stripHtml(item.description),
        url: item.guid,
        author: item['dc:creator'] || 'The Guardian',
        image: item['media:content'][0]?.$.url || '',
        language: 'en',
        published: item.pubDate,
        category: Array.isArray(item.category)
          ? item.category.map((cat: any) => cat._)
          : [NewsCategory.GUARDIAN],
      }));
    } catch (error) {
      this.logger.error(`Failed to parse RSS: ${error.message}`);
      return [];
    }
  }

  private stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '') || '';
  }
}
