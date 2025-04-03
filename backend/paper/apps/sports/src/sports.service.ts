import { SportsCategory } from '@app/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SportsService {
  private strategies: Map<SportsCategory, SportsStrategy>;
  getHello(): string {
    return 'Hello World!';
  }

  async getSportsNews(preferences: string[]) {
    preferences.map(preference => {
      
    })
  }
}
