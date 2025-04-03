import { Controller, Get } from '@nestjs/common';
import { SportsService } from './sports.service';

@Controller()
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  getHello(): string {
    return this.sportsService.getHello();
  }
}
