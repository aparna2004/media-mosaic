import { Module } from '@nestjs/common';
import { TechotainmentController } from './techotainment.controller';
import { TechotainmentService } from './techotainment.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

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
  controllers: [TechotainmentController],
  providers: [TechotainmentService],
})
export class TechotainmentModule {}
