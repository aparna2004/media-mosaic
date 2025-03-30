import { Injectable } from '@nestjs/common';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';

@Injectable()
export class ToiNewsStrategy implements NewsStrategy {
  async getNews(): Promise<NewsItem[]> {
    return [
      {
        id: '1',
        title: 'Breaking News from TOI',
        description: 'This is a TOI news story',
        url: 'https://TOI.news/1',
        author: 'John Doe',
        image: 'https://example.com/image.jpg',
        language: 'en',
        published: new Date().toISOString(),
        category: [NewsCategory.TOI],
      },
    ];
  }
}
