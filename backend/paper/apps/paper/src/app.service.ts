import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewsCategory, SportsCategory, NewsItem, Message } from '@app/types';
import { HealthCheckResponse } from '@app/types';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { PreferencesDto } from '@app/types';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('NEWS_SERVICE') private readonly newsServiceClient: ClientProxy,
    @Inject('SPORTS_SERVICE') private readonly sportsServiceClient: ClientProxy,
    @InjectMetric('news_requests_total')
    private readonly newsRequestsCounter: Counter,
    @InjectMetric('news_request_duration_seconds')
    private readonly newsRequestDuration: Histogram,
    @InjectMetric('sports_requests_total')
    private readonly sportsRequestCounter: Counter,
    @InjectMetric('sports_request_duration_seconds')
    private readonly sportsRequestDuration: Histogram,
  ) {}

  getHello(): string {
    return 'Gateway service(paper) is running';
  }

  async getGeneralNews(email: string): Promise<NewsItem[]> {
    const end = this.newsRequestDuration.startTimer();
    try {
      const preferences: PreferencesDto = await lastValueFrom(
        this.userServiceClient.send(Message.GET_PREFERENCES, { email }),
      );
      const news: NewsItem[] = await lastValueFrom(
        this.newsServiceClient.send(Message.GET_GENERAL_NEWS, {
          preferences: preferences.news,
        }),
      );
      this.newsRequestsCounter.inc();
      return news;
    } finally {
      end();
    }
  }

  async getNews(): Promise<NewsItem[]> {
    const end = this.newsRequestDuration.startTimer();
    try {
      const news: NewsItem[] = await lastValueFrom(
        this.newsServiceClient.send(Message.GET_NEWS, {}),
      );
      this.newsRequestsCounter.inc();
      return news;
    } finally {
      end();
    }
  }

  async getSportsNews(email: string) {
    const end = this.sportsRequestDuration.startTimer();
    try {
      const preferences: PreferencesDto = await lastValueFrom(
        this.userServiceClient.send(Message.GET_PREFERENCES, { email }),
      );
      const news: NewsItem[] = await lastValueFrom(
        this.sportsServiceClient.send(Message.GET_SPORTS_NEWS, {
          preferences: preferences.news,
        }),
      );
      this.sportsRequestCounter.inc();
      return news;
    } finally {
      end();
    }
  }

  getCategories() {
    return {
      news: Object.values(NewsCategory),
      sports: Object.values(SportsCategory),
    };
  }

  async setPreferences(
    email: string,
    preferences: PreferencesDto,
  ): Promise<any> {
    return await lastValueFrom(
      this.userServiceClient.send(Message.SET_PREFERENCES, {
        email,
        preferences,
      }),
    );
  }

  async checkServicesHealth() {
    try {
      const [userHealth, newsHealth] = await Promise.all([
        lastValueFrom(
          this.userServiceClient.send<HealthCheckResponse>(
            Message.HEALTH_CHECK,
            {},
          ),
        ),
        lastValueFrom(
          this.newsServiceClient.send<HealthCheckResponse>(
            Message.HEALTH_CHECK,
            {},
          ),
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
        error: error as Error,
      };
    }
  }
}
