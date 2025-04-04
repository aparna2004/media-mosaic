import { SportsItem } from '@app/types';
import { SportsStrategy } from '../interfaces/sports-strategy.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nbaFallback } from '../data/nbaFallback';
import axios from 'axios';

@Injectable()
export class NBAStrategy implements SportsStrategy {
  private readonly logger = new Logger(NBAStrategy.name);
  private readonly API_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('NBA_URL') ?? '';
  }

  async getSportNews(): Promise<SportsItem[]> {
    try {
      const response = await axios.get(this.API_URL);
      return this.parseToSportsItems(response.data);
    } catch (error: unknown) {
      this.logger.warn(`Failed to fetch NFL news: ${error.message}`);
      return this.parseToSportsItems(nbaFallback);
    }
  }
  private parseToSportsItems(apiData: any): SportsItem[] {
    return apiData.articles.reduce((acc: SportsItem[], curr) => {
      if (curr.type == 'HeadlineNews' || curr.type == 'Story') {
        return [
          ...acc,
          {
            id: String(curr.id),
            title: curr.headline,
            description: curr.description,
            published: curr.published,
            url: curr.links.web.href,
            image: curr.images[0].url,
            category: curr.categories
              .map((category) => category.description ?? '')
              .filter((x) => x !== ''),
          },
        ];
      } else {
        return acc;
      }
    }, []);
  }
}
