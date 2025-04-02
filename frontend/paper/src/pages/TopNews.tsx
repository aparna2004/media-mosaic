import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NewsLayout from "@/components/NewsLayout";
import { NewsItem } from "@/types/news";

const API_URL = 'http://localhost:3000/news';

const fetchNews = async () => {
  const { data } = await axios.get(API_URL);
  console.log('Fetched news:', data);
 
  return data as NewsItem[];
};

const TopNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold text-red-600">
          {error instanceof Error ? error.message : 'Failed to load news'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto overflow-auto">
      <NewsLayout news={news || []} />
    </div>
  );
};

export default TopNews;