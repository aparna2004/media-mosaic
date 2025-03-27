import { useEffect, useState } from 'react';
import NewsLayout from "@/components/NewsLayout";
import { NewsItem, NewsResponse } from "@/types/news";
import newsData from '@/data/current.json';  // Direct import of JSON

const TopNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (newsData && newsData.news) {
        setNews(newsData.news);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading news...</div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">No news available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <NewsLayout news={news} />
    </div>
  );
};

export default TopNews;