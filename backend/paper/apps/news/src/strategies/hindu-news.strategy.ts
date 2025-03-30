import { Injectable } from '@nestjs/common';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';

@Injectable()
export class HinduNewsStrategy implements NewsStrategy {
  async getNews(): Promise<NewsItem[]> {
    return [
      {
        id: '1',
        title: 'Breaking News from Hindu',
        description: 'This is a hindu news story',
        url: 'https://hindu.news/1',
        author: 'John Doe',
        image: 'https://example.com/image.jpg',
        language: 'en',
        published: new Date().toISOString(),
        category: [NewsCategory.HINDU],
      },
    ];
  }
}
