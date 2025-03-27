import NewsCard from "./NewsCard";
import { articles } from "@/data/articles";

const NewsLayout = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Article */}
        <div className="md:col-span-8">
          <NewsCard
            title={articles[0].title}
            description={articles[0].description}
            time={articles[0].time}
            category={articles[0].category}
            isFeature={true}
          />
        </div>

        {/* Side Articles */}
        <div className="md:col-span-4 grid grid-cols-1 gap-6">
          {articles.slice(1).map((article, index) => (
            <NewsCard
              key={index}
              title={article.title}
              time={article.time}
              isFeature={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsLayout;