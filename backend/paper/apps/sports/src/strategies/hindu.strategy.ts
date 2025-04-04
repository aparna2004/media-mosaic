import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SportsStrategy } from '../interfaces/sports-strategy.interface';
import { SportsItem } from '@app/types';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { hinduFallback } from '../data/hinduFallback';
@Injectable()
export class HinduStrategy implements SportsStrategy {
  private readonly logger = new Logger(HinduStrategy.name);
  private readonly API_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('INDIAN_SPORTS_URL') ?? '';
  }

  async getSportNews(): Promise<SportsItem[]> {
    try {
      const response = await axios.get(this.API_URL);
      return this.parseRssToSportsItems(response.data as string);
    } catch (error) {
      this.logger.warn(`Failed to fetch Hindu news: ${error.message}`);
      return this.parseRssToSportsItems(hinduFallback);
    }
  }

  private async parseRssToSportsItems(rssData: string): Promise<SportsItem[]> {
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
        image: this.extractImage(item['media:content']),
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
