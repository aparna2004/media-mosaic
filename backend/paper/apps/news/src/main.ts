import { NestFactory } from '@nestjs/core';
import { NewsModule } from './news.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NewsModule);

  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });

  // HTTP for Prometheus metrics
  await app.listen(4002);
  await app.startAllMicroservices();
}
bootstrap();
