import { NestFactory } from '@nestjs/core';
import { FinanceModule } from './finance.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(FinanceModule);
  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3004,
    },
  });

  // HTTP for Prometheus metrics
  await app.listen(4004);
  await app.startAllMicroservices();
}
bootstrap();
