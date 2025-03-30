import { Controller } from '@nestjs/common';
import { NewsService } from './news.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern('get_news')
  async getNews(data: { preferences: string[] }): Promise<any> {
    return this.newsService.getNews(data.preferences);
  }
}
