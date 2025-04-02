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

  const featuredNews = filteredNews[0];
  const sideNews = filteredNews.slice(1, 4);
  console.log("f", filteredNews);
  console.log("s", sideNews);


  return (
    <div className="max-w-9xl mx-auto px-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Article */}
        <div className="md:col-span-8">
          <NewsCard
            news={featuredNews}
            isFeature={true}
          />
        </div>

        {/* Side Articles */}
        <div className="md:col-span-4 grid grid-cols-1 gap-6">
          {sideNews.map((article) => (
            <NewsCard
              key={article.id}
              news={article}
              isFeature={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsLayout;