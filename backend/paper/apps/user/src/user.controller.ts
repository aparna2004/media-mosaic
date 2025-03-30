import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { HealthCheckResponse } from '@app/types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('validate_user')
  async validateUser(data: { email: string; password: string }): Promise<any> {
    return this.userService.validateUser(data.email, data.password);
  }

  @MessagePattern('create_user')
  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<any> {
    return this.userService.createUser(data);
  }

  @MessagePattern('get_news_preferences')
  async getNewsPreferences(data: { email: string }): Promise<string[]> {
    return this.userService.getNewsPreferences(data.email);
  }

  @MessagePattern('set_news_preferences')
  async setNewsPreferences(data: {
    email: string;
    newsArray: string[];
  }): Promise<any> {
    return this.userService.setNewsPreferences(data.email, data.newsArray);
  }

  @MessagePattern('health_check')
  healthCheck(): HealthCheckResponse {
    return {
      service: 'user',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };
  }
  
}
