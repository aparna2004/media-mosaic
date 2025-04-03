import { NestFactory } from '@nestjs/core';
import { SportsModule } from './sports.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(SportsModule);
  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3003,
    },
  });

  // HTTP for Prometheus metrics
  await app.listen(4003);
  await app.startAllMicroservices();
}
bootstrap();
