import { NestFactory } from '@nestjs/core';
import { TechotainmentModule } from './techotainment.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TechotainmentModule);

  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3006,
    },
  });

  // HTTP for Prometheus metrics
  await app.listen(4006);
  await app.startAllMicroservices();
}
bootstrap();
