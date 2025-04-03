import { SportsCategory } from '@app/types';
import { Injectable } from '@nestjs/common';
import { SportsStrategy } from './interfaces/sports-strategy.interface';
import { FootballStrategy } from './strategies/football.strategy';
import { HinduStrategy } from './strategies/hindu.strategy';
import { NBAStrategy } from './strategies/nba.strategy';

@Injectable()
export class SportsService {
  private strategies: Map<SportsCategory, SportsStrategy>;
  constructor(
    private readonly footballStrategy: FootballStrategy,
    private readonly indianStrategy: HinduStrategy,
    private readonly nbaStrategy: NBAStrategy,
  ) {
    this.strategies = new Map<SportsCategory, SportsStrategy>([
      [SportsCategory.FOOTBALL, footballStrategy],
      [SportsCategory.INDIAN, indianStrategy],
      [SportsCategory.NBA, nbaStrategy],
    ]);
  }

  async getSportsNews(preferences: string[]) {
    console.log(preferences);
    const sportsPromises = preferences.map(async (pref) => {
      const strategy = this.strategies.get(pref as SportsCategory);
      console.log('Strategy:', strategy);
      if (!strategy) {
        return [];
      }
      return strategy.getSportNews();
    });

    const sportsArrays = await Promise.all(sportsPromises);
    return sportsArrays.flat();
  }
}
