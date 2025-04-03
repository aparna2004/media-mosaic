import { Injectable } from '@nestjs/common';

@Injectable()
export class SportsService {
  getHello(): string {
    return 'Hello World!';
  }
}
