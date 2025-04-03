import { NewsItem } from "@/types/news";
import NewsCard from "./NewsCard";

interface NewsLayoutProps {
  news: NewsItem[];
  category?: string;
}

const NewsLayout = ({ news, category }: NewsLayoutProps) => {
  // Filter English news and by category if specified
  const filteredNews = news.filter(item => 
    item.language === 'en' && 
    (!category || item.category.includes(category))
  );

  // Create chunks of 4 articles (1 main + 3 side)
  const newsChunks = filteredNews.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / 4);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, [] as NewsItem[][]);

  return (
    <div className="max-w-7xl mx-auto px-4 min-h-screen space-y-8">
      {newsChunks.map((chunk, index) => {
        const mainArticle = chunk[0];
        const sideArticles = chunk.slice(1);

        return (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Article */}
            <div className="md:col-span-8">
              <NewsCard
                news={mainArticle}
                isFeature={true}
              />
            </div>

            {/* Side Articles */}
            <div className="md:col-span-4 grid grid-cols-1 gap-6">
              {sideArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  news={article}
                  isFeature={false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsLayout;