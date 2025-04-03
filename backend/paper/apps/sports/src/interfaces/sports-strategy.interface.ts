import { SportsItem } from '@app/types';

export interface SportsStrategy {
  getSportNews(): Promise<SportsItem[]>;
}
