import { Controller } from '@nestjs/common';
import { SportsService } from './sports.service';
import { MessagePattern } from '@nestjs/microservices';
import { HealthCheckResponse, Message } from '@app/types';

@Controller()
export class SportsController {
  constructor(private readonly newsService: SportsService) {}

  @MessagePattern(Message.GET_SPORTS_NEWS)
  async getSportsNews(data: { preferences: string[] }): Promise<any> {
    return this.newsService.getSportsNews(data.preferences);
  }

  @MessagePattern(Message.HEALTH_CHECK)
  healthCheck(): HealthCheckResponse {
    return {
      service: 'news',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      uptime: process.uptime(),
    };
  }
}
