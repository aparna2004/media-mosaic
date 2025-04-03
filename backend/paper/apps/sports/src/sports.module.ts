import { Module } from '@nestjs/common';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

@Module({
  imports: [],
  controllers: [SportsController],
  providers: [SportsService],
})
export class SportsModule {}
