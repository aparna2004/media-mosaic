import { Controller } from '@nestjs/common';
import { NewsService } from './news.service';
import { MessagePattern } from '@nestjs/microservices';
import { HealthCheckResponse } from '@app/types';

@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern('get_news')
  async getNews(data: { preferences: string[] }): Promise<any> {
    return this.newsService.getNews(data.preferences);
  }

  @MessagePattern('health_check')
  healthCheck(): HealthCheckResponse {
    return {
      service: 'news',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };
  }
}
