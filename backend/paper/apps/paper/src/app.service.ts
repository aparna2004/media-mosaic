import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewsCategory, SportsCategory, NewsItem } from '@app/types';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('NEWS_SERVICE') private readonly newsServiceClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Gateway service(paper) is running';
  }

  async getGeneralNews(email: string): Promise<NewsItem[]> {
    const preferences: string[] = await lastValueFrom(
      this.userServiceClient.send('get_news_preferences', { email }),
    );
    const news: NewsItem[] = await lastValueFrom(
      this.newsServiceClient.send('get_news', { preferences }),
    );
    return news;
  }

  // getSportsNews(email: string) {
  //   const preferences: string[] = await lastValueFrom(
  //     this.userServiceClient.send('get_news_preferences', { email }),
  //   );
  // }

  getCategories() {
    return {
      news: Object.values(NewsCategory),
      sports: Object.values(SportsCategory),
    };
  }

  async setNewsPreferences(
    email: string,
    newsArray: string[],
  ): Promise<any> {
    return await lastValueFrom(
      this.userServiceClient.send('set_news_preferences', {
        email,
        newsArray,
      }),
    );
  }
}
