import { NewsService } from './news.service';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('general')
  @ApiOperation({ summary: 'Get general news for user' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  getGeneralNews(@Request() req: any) {
    return this.newsService.getGeneralNews(req.user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Get news for unauthorized user' })
  @ApiResponse({ status: 200, description: 'Returns news articles' })
  getNews() {
    return this.newsService.getNews();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('sports')
  @ApiOperation({ summary: 'Get sports news' })
  async getSportsNews(@Request() req: any) {
    return await this.newsService.getSportsNews(req.user.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('tickers')
  @ApiOperation({ summary: 'Get finance tickers' })
  async getFinanceTickers() {
    return await this.newsService.getFinanceTickers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('currency')
  @ApiOperation({ summary: 'Get finance tickers' })
  async getCurrency() {
    return await this.newsService.getCurrency();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('finance')
  @ApiOperation({ summary: 'Get finance news' })
  async getFinance() {
    return await this.newsService.getFinance();
  }

  @Get('tech')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get tech news' })
  async getTech() {
    return await this.newsService.getTech();
  }

  @Get('entertainment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get entertainment news' })
  async getEntertainment() {
    return await this.newsService.getEntertainment();
  }
}
