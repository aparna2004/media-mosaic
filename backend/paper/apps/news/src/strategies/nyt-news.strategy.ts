import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';
import axios from 'axios';
import { nytFallback } from '../data/nytFallback';

@Injectable()
export class NytNewsStrategy implements NewsStrategy {
  private readonly logger = new Logger(NytNewsStrategy.name);
  private readonly API_URL: string;
  private readonly API_KEY: string;
  private readonly FALLBACK_DATA = nytFallback;

  constructor(private configService: ConfigService) {
    this.API_URL = this.configService.get<string>('NYT_API_URL') || '';
    this.API_KEY = this.configService.get<string>('NYT_API_KEY') || '';
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get(this.API_URL, {
        params: {
          'api-key': this.API_KEY,
        },
      });

      return this.transformNYTResponse(response.data);
    } catch (error) {
      this.logger.warn(`Failed to fetch NYT news: ${error.message}`);
      return this.transformNYTResponse(this.FALLBACK_DATA);
    }
  }

  private transformNYTResponse(data: any): NewsItem[] {
    return data.results.map((article: any) => ({
      id: article.uri,
      title: article.title,
      description: article.abstract,
      url: article.url,
      author: article.byline.replace('By ', '').trim(),
      image: article.multimedia?.[0]?.url || '',
      language: 'en',
      category: [
        NewsCategory.NYT,
        article.section,
        ...(article.subsection ? [article.subsection] : []),
        ...(article.des_facet || []),
      ],
      published: new Date(article.published_date).toISOString(),
    }));
  }
}
