import { NewsItem } from '@app/types';

export interface NewsStrategy {
  getNews(): Promise<NewsItem[]>;
}
