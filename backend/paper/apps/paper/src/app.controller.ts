import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SetNewsPreferencesDto } from './dtos/news-preferences.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('news/general')
  @ApiOperation({ summary: 'Get general news for user' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  getGeneralNews(@Request() req: any) {
    return this.appService.getGeneralNews(req.user.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('set-news-preferences')
  @ApiOperation({ summary: 'Set user news preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  setNewsPreferences(
    @Request() req: any,
    @Body() setNewsPreferencesDto: SetNewsPreferencesDto,
  ) {
    return this.appService.setNewsPreferences(
      req.user.email,
      setNewsPreferencesDto.newsArray,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get available news categories' })
  @ApiResponse({ status: 200, description: 'Returns all news categories' })
  getCategories() {
    return this.appService.getCategories();
  }
}
