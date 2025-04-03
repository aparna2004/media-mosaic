export enum SportsCategory {
  INDIAN = 'indian',
  FOOTBALL = 'football',
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
