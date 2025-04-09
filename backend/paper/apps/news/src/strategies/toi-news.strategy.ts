import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem } from '@app/types';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { toiNewsFallback } from '../data/toiNewsFallback';

@Injectable()
export class ToiNewsStrategy implements NewsStrategy {
  private readonly logger = new Logger(ToiNewsStrategy.name);
  private readonly API_URL: string;
  private readonly FALLBACK_DATA: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('TOI_URL') ?? '';
    this.FALLBACK_DATA = toiNewsFallback;
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get<string>(this.API_URL);
      return this.parseXmlToNewsItems(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch TOI news: ${error.message}`);
      return this.parseXmlToNewsItems(this.FALLBACK_DATA);
    }
  }

  private async parseXmlToNewsItems(xmlData: string): Promise<NewsItem[]> {
    try {
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xmlData);
      const items = result.rss.channel.item;

      return items.map((item: any) => ({
        id: item.guid,
        title: item.title,
        description: this.cleanDescription(item.description),
        url: item.link,
        author: item['dc:creator'] || 'Times of India',
        image: item.enclosure?.$.url || '',
        language: 'en',
        category: this.extractCategories(item.link),
        published: new Date(item.pubDate).toISOString(),
      }));
    } catch (error) {
      this.logger.error(`Failed to parse XML: ${error.message}`);
      return [];
    }
  }

  private cleanDescription(description: string): string {
    if (!description) return '';
    // Remove CDATA and clean up HTML tags
    return description
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private extractCategories(url: string): string[] {
    const categories = ['toi'];

    // Extract category from URL
    const urlParts = url.split('/');
    if (urlParts.length > 4) {
      categories.push(urlParts[3]); // Add main category
      if (urlParts[4] && urlParts[4] !== 'news') {
        categories.push(urlParts[4]); // Add subcategory
      }
    }

    return categories;
  }
}
