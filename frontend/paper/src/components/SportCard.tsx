import { useState } from 'react';
import { SportsItem } from '@/types/sports';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface SportCardProps {
  sport: SportsItem;
  priority?: 'high' | 'medium' | 'low';
}

export default function SportCard({ sport, priority = 'medium' }: SportCardProps) {
  const [imageError, setImageError] = useState(false);

  // Determine size class based on priority
  const sizeClass = {
    high: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
    medium: 'col-span-2 md:col-span-1 md:row-span-1',
    low: 'col-span-1 row-span-1'
  }[priority];

  // Format the published date
  const formattedDate = formatDistanceToNow(new Date(sport.published), { addSuffix: true });
  
  // Sport icon mapping
  const getSportIcon = (categories: string[]): string => {
    const iconMap: Record<string, string> = {
      'cricket': '🏏',
      'football': '⚽',
      'tennis': '🎾',
      'basketball': '🏀',
      'formula1': '🏎️',
      'hockey': '🏑',
      'badminton': '🏸',
      'baseball': '⚾',
      'golf': '⛳',
      'rugby': '🏉'
    };
    
    for (const category of categories) {
      const lowerCategory = category.toLowerCase();
      if (iconMap[lowerCategory]) {
        return iconMap[lowerCategory];
      }
    }
    
    return '🏆'; // Default sports icon
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div 
      className={`${sizeClass} overflow-hidden group relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <a 
        href={sport.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        <article className="border border-gray-300 rounded-sm h-full flex flex-col hover:shadow-md transition-shadow duration-200">
          {/* Image Section */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
            {!imageError ? (
              <img
                src={sport.image}
                alt={sport.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                {getSportIcon(sport.category)}
              </div>
            )}
            
            {/* Category Pills */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {sport.category.slice(0, 2).map((category, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-black/60 text-white text-xs rounded-sm tracking-wide uppercase font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-3 flex-grow flex flex-col">
            <h3 className="font-serif font-bold text-lg line-clamp-3 mb-1 leading-tight">
              {sport.title}
            </h3>
            
            <p className="text-gray-700 text-sm line-clamp-2 mb-2">
              {sport.description}
            </p>
            
            {/* Footer with published date */}
            <div className="mt-auto flex items-center text-xs text-gray-500 pt-2">
              <span>{formattedDate}</span>
              <span className="ml-auto">{getSportIcon(sport.category)}</span>
            </div>
          </div>
        </article>
      </a>
    </motion.div>
  );
}