import { NewsItem } from '@app/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tech } from './data/tech';
import { entertainment } from './data/entertainment';
import * as xml2js from 'xml2js';
import axios from 'axios';
@Injectable()
export class TechotainmentService {
  private readonly ENTERTAINMENT_URL: string;
  private readonly logger = new Logger(TechotainmentService.name);
  private readonly TECH_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.ENTERTAINMENT_URL =
      this.configService.get<string>('ENTERTAINMENT_URL') ?? '';
    this.TECH_URL = this.configService.get<string>('TECH_URL') ?? '';
  }

  async getEntertainment(): Promise<NewsItem[]> {
    try {
      const response = await axios.get(this.ENTERTAINMENT_URL);
      return this.parseRssToNewsItems(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch Hindu news: ${error.message}`);
      return this.parseRssToNewsItems(entertainment);
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

  async getTech(): Promise<NewsItem[]> {
    try {
      const response = await axios.get<string>(this.TECH_URL);
      return this.parseXmlToNewsItems(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch TOI news: ${error.message}`);
      return this.parseXmlToNewsItems(tech);
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
        category: this.extractCategoriesToi(item.link),
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

  private extractCategoriesToi(url: string): string[] {
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
