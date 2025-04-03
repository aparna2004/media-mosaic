import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as path from 'path';

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
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
