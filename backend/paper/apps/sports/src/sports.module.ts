import { Module } from '@nestjs/common';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { FootballStrategy } from './strategies/football.strategy';
import { HinduStrategy } from './strategies/hindu.strategy';
import { NBAStrategy } from './strategies/nba.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics', // Prometheus metrics endpoint
    }),
  ],
  controllers: [SportsController],
  providers: [SportsService, FootballStrategy, HinduStrategy, NBAStrategy],
})
export class SportsModule {}
