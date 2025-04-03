import { Injectable } from '@nestjs/common';
import { NewsItem, NewsCategory } from '@app/types';
import { NewsStrategy } from './interfaces/news-strategy.interface';
import { CurrentNewsStrategy } from './strategies/current-news.strategy';
import { NytNewsStrategy } from './strategies/nyt-news.strategy';
import { ToiNewsStrategy } from './strategies/toi-news.strategy';
import { GuardianNewsStrategy } from './strategies/guardian-news.strategy';
import { HinduNewsStrategy } from './strategies/hindu-news.strategy';

@Injectable()
export class NewsService {
  private strategies: Map<NewsCategory, NewsStrategy>;

  constructor(
    private readonly currentNewsStrategy: CurrentNewsStrategy,
    private readonly nytNewsStrategy: NytNewsStrategy,
    private readonly toiNewsStrategy: ToiNewsStrategy,
    private readonly guardianNewsStrategy: GuardianNewsStrategy,
    private readonly hinduNewsStrategy: HinduNewsStrategy,
  ) {
    this.strategies = new Map<NewsCategory, NewsStrategy>([
      [NewsCategory.CURRENT, currentNewsStrategy],
      [NewsCategory.NYT, nytNewsStrategy],
      [NewsCategory.TOI, toiNewsStrategy],
      [NewsCategory.GUARDIAN, guardianNewsStrategy],
      [NewsCategory.HINDU, hinduNewsStrategy],
    ]);
  }
  async getGeneralNews(preferences: string[]): Promise<NewsItem[]> {
    const newsPromises = preferences.map(async (pref) => {
      const strategy = this.strategies.get(pref as NewsCategory);
      console.log('Strategy:', strategy);
      if (!strategy) {
        return [];
      }
      return strategy.getNews();
    });

    const newsArrays = await Promise.all(newsPromises);
    return newsArrays.flat();
  }

  async getNews() {
    return this.guardianNewsStrategy.getNews();
  }
}
