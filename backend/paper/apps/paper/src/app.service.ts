import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewsCategory, SportsCategory, NewsItem } from '@app/types';
import { HealthCheckResponse } from '@app/types';

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

  async setNewsPreferences(email: string, newsArray: string[]): Promise<any> {
    return await lastValueFrom(
      this.userServiceClient.send('set_news_preferences', {
        email,
        newsArray,
      }),
    );
  }

  async checkServicesHealth() {
    try {
      const [userHealth, newsHealth] = await Promise.all([
        lastValueFrom(
          this.userServiceClient.send<HealthCheckResponse>('health_check', {}),
        ),
        lastValueFrom(
          this.newsServiceClient.send<HealthCheckResponse>('health_check', {}),
        ),
      ]);
      return {
        gateway: {
          status: 'ok',
          timestamp: new Date().toISOString(),
        },
        user: userHealth,
        news: newsHealth,
      };
    } catch (error: any) {
      return {
        gateway: {
          status: 'ok',
          others: 'no',
          timestamp: new Date().toISOString(),
        },
        error: error,
      };
    }
  }
}
