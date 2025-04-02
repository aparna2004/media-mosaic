import { Card, CardContent } from "@/components/ui/card";
import { NewsItem } from "@/types/news";
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  news: NewsItem;
  isFeature?: boolean;
}

const NewsCard = ({ news, isFeature = false }: NewsCardProps) => {
  if (!news) {
    return null;
  }

  const publishedTime = news.published 
    ? formatDistanceToNow(new Date(news.published), { addSuffix: true })
    : '';

  return (
    <Card className="border border-gray-200 rounded-none shadow-none hover:bg-gray-50 transition-colors h-full">
      <CardContent className={`${isFeature ? 'p-6' : 'p-4'}`}>
        <a href={news.url} target="_blank" rel="noopener noreferrer" className="block space-y-4">
          {news.category && news.category.length > 0 && (
            <span className="inline-block px-2 py-1 bg-black text-white text-xs font-semibold uppercase">
              {news.category[0]}
            </span>
          )}
          
          {isFeature && news.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title || 'News image'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className={`${isFeature ? 'text-3xl' : 'text-xl'} font-serif font-bold leading-tight hover:text-gray-700 line-clamp-3`}>
            {news.title}
          </h2>
          
          {news.description && (
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 font-serif">
              {news.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium">{publishedTime}</span>
            {news.author && (
              <span className="text-gray-400">By {news.author}</span>
            )}
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default NewsCard;