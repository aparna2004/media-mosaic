import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { PreferencesDto, HealthCheckResponse, Message } from '@app/types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(Message.VALIDATE_USER)
  async validateUser(data: { email: string; password: string }): Promise<any> {
    return this.userService.validateUser(data.email, data.password);
  }

  @MessagePattern(Message.CREATE_USER)
  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<any> {
    return this.userService.createUser(data);
  }

  @MessagePattern(Message.GET_PREFERENCES)
  async getPreferences(data: { email: string }): Promise<PreferencesDto> {
    return this.userService.getPreferences(data.email);
  }

  @MessagePattern(Message.SET_PREFERENCES)
  async setPreferences(data: {
    email: string;
    preferences: PreferencesDto;
  }): Promise<any> {
    return this.userService.setPreferences(data.email, data.preferences);
  }

  @MessagePattern(Message.HEALTH_CHECK)
  healthCheck(): HealthCheckResponse {
    return {
      service: 'user',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      uptime: process.uptime(),
    };
  }
  
  
}
