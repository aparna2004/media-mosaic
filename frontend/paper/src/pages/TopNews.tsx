import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NewsLayout from "@/components/NewsLayout";
import { NewsItem } from "@/types/news";

const API_KEY = 'rGagiwIiYf5jPiTQxYV9zjmcIM3tFRr3Rag5SlSkgi9odQpT'; // Move this to .env file
const API_URL = 'https://api.currentsapi.services/v1/latest-news';

const fetchNews = async () => {
  const { data } = await axios.get(API_URL, {
    params: {
      language: 'en',
      apiKey: API_KEY
    }
  });
  
  if (data.status !== 'ok') {
    throw new Error('Failed to fetch news');
  }
  
  return data.news as NewsItem[];
};

const TopNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">
          {error instanceof Error ? error.message : 'Failed to load news'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <NewsLayout news={news || []} />
    </div>
  );
};

export default TopNews;