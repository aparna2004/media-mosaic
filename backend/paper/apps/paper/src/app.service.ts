import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  HealthCheckResponse,
  NewsCategory,
  SportsCategory,
  Message,
  PreferencesDto,
} from '@app/types';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('NEWS_SERVICE') private readonly newsServiceClient: ClientProxy,
    @Inject('SPORTS_SERVICE') private readonly sportsServiceClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Gateway service(paper) is running';
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
        lastValueFrom(
          this.sportsServiceClient.send<HealthCheckResponse>(
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

  async getPreferences(email: string): Promise<PreferencesDto> {
    return await lastValueFrom(
      this.userServiceClient.send<PreferencesDto>(Message.GET_PREFERENCES, {
        email,
      }),
    );
  }
}
