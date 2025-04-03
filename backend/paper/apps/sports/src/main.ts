import { NestFactory } from '@nestjs/core';
import { SportsModule } from './sports.module';

async function bootstrap() {
  const app = await NestFactory.create(SportsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
