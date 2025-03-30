import { Injectable } from '@nestjs/common';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';

@Injectable()
export class NytNewsStrategy implements NewsStrategy {
  async getNews(): Promise<NewsItem[]> {
    return [
      {
        id: '1',
        title: 'Breaking News from NYT',
        description: 'This is a NYT news story',
        url: 'https://NYT.news/1',
        author: 'John Doe',
        image: 'https://example.com/image.jpg',
        language: 'en',
        published: new Date().toISOString(),
        category: [NewsCategory.NYT],
      },
    ];
  }
}
