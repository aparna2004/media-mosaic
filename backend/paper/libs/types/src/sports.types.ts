export enum SportsCategory {
  CRICKET = 'cricket',
  FOOTBALL = 'football',
  NFL = 'nfl',
  MLB = 'mlb',
  NHL = 'nhl',
  NBA = 'nba',
}

export interface SportsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  category: string[];
  published: string;
}
