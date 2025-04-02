import { Injectable, Logger } from '@nestjs/common';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { currentNewsFallback } from '../data/currentNewsFallback';

@Injectable()
export class CurrentNewsStrategy implements NewsStrategy {
  private readonly logger = new Logger(CurrentNewsStrategy.name);
  private readonly API_URL: string;
  private readonly API_KEY: string;
  private readonly FALLBACK_DATA = currentNewsFallback;

  constructor(private configService: ConfigService) {
    this.API_URL = this.configService.get<string>('CURRENT_NEWS_API_URL') || '';
    this.API_KEY = this.configService.get<string>('CURRENT_NEWS_API_KEY') || '';
    console.log('API_URL:', this.API_URL);
    console.log('API_KEY:', this.API_KEY);
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get<{ status: string; news: any[] }>(this.API_URL, {
        params: {
          language: 'en',
          apiKey: this.API_KEY,
        },
      });
      // console.log('Response:', response);
      if (response.status !== 200) {
        throw new Error(`API response status: ${response.status}`);
      }
      if (response.data.status != 'ok') {
        throw new Error('Invalid API response format');
      }
      return this.transformApiResponse(response.data);
    } catch (error) {
      this.logger.warn(
        `API call failed: ${error.message}. Using fallback data.`,
      );
      return this.getFallbackNews();
    }

  }
  private getFallbackNews(): NewsItem[] {
    try {
      const data = this.FALLBACK_DATA;
      return data.news.map((item) => ({
        ...item,
        category: [NewsCategory.CURRENT],
        published: item.published,
      }));
    } catch (error) {
      this.logger.error(`Failed to read fallback file: ${error.message}`);
      return [
        {
          id: '1',
          title: 'Emergency Fallback News',
          description:
            'Unable to fetch news from primary and secondary sources',
          url: 'https://current.news/fallback',
          author: 'System',
          image: '',
          language: 'en',
          published: new Date().toISOString(),
          category: [NewsCategory.CURRENT],
        },
      ];
    }
  }

  private transformApiResponse(apiData: any): NewsItem[] {
    // Transform API response to match NewsItem interface
    return apiData.news?.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: article.url,
      author: article.author,
      image: article.imageUrl,
      language: article.lang,
      published: new Date(article.published),
      category: article.category,
    }));
  }
}
