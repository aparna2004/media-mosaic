export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  author: string;
  image: string;
  language: string;
  category: string[];
  published: string;
}

export enum NewsCategory {
  CURRENT = 'current',
  NYT = 'nyt',
  TOI = 'toi',
  GUARDIAN = 'guardian',
  HINDU = 'hindu',
}
