import { Controller } from '@nestjs/common';
import { NewsService } from './news.service';
import { MessagePattern } from '@nestjs/microservices';
import { HealthCheckResponse, Message } from '@app/types';

@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern(Message.GET_GENERAL_NEWS)
  async getGeneralNews(data: { preferences: string[] }): Promise<any> {
    return this.newsService.getGeneralNews(data.preferences);
  }

  @MessagePattern(Message.GET_NEWS)
  async getNews(): Promise<any> {
    return this.newsService.getNews();
  }

  @MessagePattern(Message.HEALTH_CHECK)
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
