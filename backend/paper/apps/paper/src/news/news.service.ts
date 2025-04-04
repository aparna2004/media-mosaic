import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  PreferencesDto,
  NewsItem,
  Message,
  SportsItem,
  FinanceTicker,
} from '@app/types';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class NewsService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('NEWS_SERVICE') private readonly newsServiceClient: ClientProxy,
    @Inject('SPORTS_SERVICE') private readonly sportsServiceClient: ClientProxy,
    @Inject('FINANCE_SERVICE')
    private readonly financeServiceClient: ClientProxy,
    @Inject('TECHNOTAINMENT_SERVICE')
    private readonly technotainmentServiceClient: ClientProxy,
    @InjectMetric('news_requests_total')
    private readonly newsRequestsCounter: Counter,
    @InjectMetric('news_request_duration_seconds')
    private readonly newsRequestDuration: Histogram,
    @InjectMetric('sports_requests_total')
    private readonly sportsRequestCounter: Counter,
    @InjectMetric('sports_request_duration_seconds')
    private readonly sportsRequestDuration: Histogram,
  ) {}

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
      const news: SportsItem[] = await lastValueFrom(
        this.sportsServiceClient.send(Message.GET_SPORTS_NEWS, {
          preferences: preferences.sports,
        }),
      );
      this.sportsRequestCounter.inc();
      return news;
    } finally {
      end();
    }
  }

  async getFinanceTickers() {
    return await lastValueFrom(
      this.financeServiceClient.send<FinanceTicker[]>(Message.GET_TICKERS, {}),
    );
  }

  async getCurrency() {
    return await lastValueFrom(
      this.financeServiceClient.send<object>(Message.GET_CURRENCY, {}),
    );
  }

  async getFinance() {
    return await lastValueFrom(
      this.financeServiceClient.send<NewsItem[]>(Message.GET_FINANCE, {}),
    );
  }

  async getTech() {
    return await lastValueFrom(
      this.technotainmentServiceClient.send<NewsItem[]>(Message.GET_TECH, {}),
    );
  }

  async getEntertainment() {
    return await lastValueFrom(
      this.technotainmentServiceClient.send<NewsItem[]>(
        Message.GET_ENTERTAINMENT,
        {},
      ),
    );
  }
}
