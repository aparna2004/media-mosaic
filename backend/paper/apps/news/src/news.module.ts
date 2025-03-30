import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CurrentNewsStrategy } from './strategies/current-news.strategy';
import { NytNewsStrategy } from './strategies/nyt-news.strategy';
import { ToiNewsStrategy } from './strategies/toi-news.strategy';
import { GuardianNewsStrategy } from './strategies/guardian-news.strategy';
import { HinduNewsStrategy } from './strategies/hindu-news.strategy';
import * as path from 'path';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    CurrentNewsStrategy,
    NytNewsStrategy,
    ToiNewsStrategy,
    GuardianNewsStrategy,
    HinduNewsStrategy,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
  ],
})
export class NewsModule {}
