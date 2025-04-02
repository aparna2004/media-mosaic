import { Injectable } from '@nestjs/common';
import { NewsStrategy } from '../interfaces/news-strategy.interface';
import { NewsItem, NewsCategory } from '@app/types';

@Injectable()
export class GuardianNewsStrategy implements NewsStrategy {
  async getNews(): Promise<NewsItem[]> {
    return [
      {
        id: '1',
        title: 'Breaking News from Guardian',
        description: 'This is a guardian news story',
        url: 'https://current.news/1',
        author: 'John Doe',
        image: 'https://example.com/image.jpg',
        language: 'en',
        published: new Date().toISOString(),
        category: [NewsCategory.GUARDIAN],
      },
    ];
  }
}
