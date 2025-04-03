import { NewsCategory } from './news.types';
import { SportsCategory } from './sports.types';

export class PreferencesDto {
  news: NewsCategory[];
  sports: SportsCategory[];
}
