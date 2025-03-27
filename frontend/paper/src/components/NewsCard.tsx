import { Card, CardContent } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  description?: string;
  time: string;
  category?: string;
  isFeature?: boolean;
}

const NewsCard = ({ title, description, time, category, isFeature = false }: NewsCardProps) => {
  return (
    <Card className="border border-gray-200 rounded-none shadow-none hover:bg-gray-50 transition-colors h-full">
      <CardContent className={`${isFeature ? 'p-6' : 'p-4'}`}>
        <div className="space-y-4">
          {category && (
            <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-semibold">
              {category}
            </span>
          )}
          <h2 className={`${isFeature ? 'text-3xl' : 'text-xl'} font-serif font-bold leading-tight hover:text-gray-700 line-clamp-3`}>
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">{time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;