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

export interface NewsResponse {
  status: string;
  news: NewsItem[];
  page: number;
}