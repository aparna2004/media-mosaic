import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheckResponse } from '@app/types';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PreferencesDto } from './dto/peferences.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('health')
  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('health')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiOperation({ summary: 'Get protected route information' })
  getProtectedRoute(@Request() req: any) {
    return {
      message: 'This is a protected route:)',
      userId: req.user.userId,
      email: req.user.email,
    };
  }

  @ApiTags('health')
  @Get('health')
  @ApiOperation({ summary: 'Get gateway service health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check response',
    schema: {
      example: {
        service: 'gateway',
        status: 'ok',
        timestamp: '2024-03-30T12:00:00.000Z',
        version: '1.0.0',
        uptime: 123456,
      },
    },
  })
  checkHealth(): HealthCheckResponse {
    return {
      service: 'gateway',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };
  }

  @ApiTags('health')
  @Get('health/services')
  @ApiOperation({ summary: 'Get all microservices health status' })
  @ApiResponse({
    status: 200,
    description: 'All services health check response',
    schema: {
      example: {
        gateway: { status: 'ok', timestamp: '2024-03-30T12:00:00.000Z' },
        news: { status: 'ok', timestamp: '2024-03-30T12:00:00.000Z' },
        user: { status: 'ok', timestamp: '2024-03-30T12:00:00.000Z' },
      },
    },
  })
  async checkServicesHealth() {
    return this.appService.checkServicesHealth();
  }

  @ApiTags('news')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('news/general')
  @ApiOperation({ summary: 'Get general news for user' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  getGeneralNews(@Request() req: any) {
    return this.appService.getGeneralNews(req.user.email);
  }

  @ApiTags('news')
  @Get('news')
  @ApiOperation({ summary: 'Get news for unauthorized user' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  getNews() {
    return this.appService.getNews();
  }

  @ApiTags('news')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('set-preferences')
  @ApiOperation({ summary: 'Set user news preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  setNewsPreferences(
    @Request() req: any,
    @Body() setPreferencesDto: PreferencesDto,
  ) {
    return this.appService.setPreferences(req.user.email, setPreferencesDto);
  }

  @ApiTags('news')
  @Get('categories')
  @ApiOperation({ summary: 'Get available news categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all news categories',
    schema: {
      example: {
        news: ['current', 'nyt', 'toi', 'guardian', 'hindu'],
        sports: ['cricket', 'football', 'nfl', 'mlb', 'nhl', 'nba'],
      },
    },
  })
  getCategories() {
    return this.appService.getCategories();
  }

  @ApiTags('news')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('news/sports')
  @ApiOperation({ summary: 'Get sports news' })
  async getSportsNews(@Request() req: any) {
    await this.appService.getSportsNews(req.user.email);
  }

  @ApiTags('news')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('news/sports')
  @ApiOperation({ summary: 'Get sports news' })
  async getPreferences(@Request() req: any) {
    await this.appService.getSportsNews(req.user.email);
  }
}
