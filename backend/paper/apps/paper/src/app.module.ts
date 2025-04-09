import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { metricsProviders } from './metrics/metrics.providers';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'NEWS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'SPORTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
      {
        name: 'FINANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3004,
        },
      },
      {
        name: 'TECHNOTAINMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3006,
        },
      },
    ]),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...metricsProviders],
})
export class AppModule {}
