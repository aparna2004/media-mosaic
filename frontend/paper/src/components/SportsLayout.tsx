import { SportsItem } from '@/types/sports';
import SportCard from '@/components/SportCard';
import StockTicker from '@/components/StockTicker';
import { useEffect, useState } from 'react';

interface SportsLayoutProps {
  sports: SportsItem[];
}

export default function SportsLayout({ sports }: SportsLayoutProps) {
  const [layoutReady, setLayoutReady] = useState(false);

  // Assign priorities based on position and categories
  const assignPriorities = (items: SportsItem[]): (SportsItem & { priority: 'high' | 'medium' | 'low' })[] => {
    if (!items || items.length === 0) return [];
    
    return items.map((item, index) => {
      let priority: 'high' | 'medium' | 'low';
      
      // First item is high priority
      if (index === 0) {
        priority = 'high';
      } 
      // Every 5th item gets medium priority
      else if (index % 5 === 0) {
        priority = 'medium';
      }
      // Cricket and football (popular sports) get medium priority
      else if (item.category.some(cat => 
        ['cricket', 'football', 'ipl', 'fifa', 'worldcup'].includes(cat.toLowerCase()))
      ) {
        priority = 'medium';
      }
      // Everything else is low priority
      else {
        priority = 'low';
      }
      
      return { ...item, priority };
    });
  };

  // For animation timing
  useEffect(() => {
    setLayoutReady(true);
  }, []);

  // Get prioritized sports
  const prioritizedSports = assignPriorities(sports);
  
  // Group sports by category for section organization
  const sportsByCategory: Record<string, SportsItem[]> = {};
  
  sports.forEach(sport => {
    // Use the first category as the main category
    const mainCategory = sport.category[0] || 'Other';
    
    if (!sportsByCategory[mainCategory]) {
      sportsByCategory[mainCategory] = [];
    }
    
    sportsByCategory[mainCategory].push(sport);
  });

  if (!layoutReady) {
    return <div className="min-h-screen">Loading...</div>;
  }

  return (
    <div className="pb-10">
      {/* Header with title */}
      <div className="border-b border-gray-300 mb-6">
        <h1 className="font-serif text-3xl font-bold pb-2">Sports</h1>
      </div>
      
      {/* Featured sports section */}
      {prioritizedSports.length > 0 && (
        <div className="mb-8">
          <div className="border-b border-gray-300 mb-4">
            <h2 className="font-serif text-xl font-bold pb-2">
              Top Stories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* First row with featured content */}
            {prioritizedSports.slice(0, 5).map((sport) => (
              <SportCard 
                key={sport.id} 
                sport={sport} 
                priority={sport.priority}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Category sections */}
      {Object.entries(sportsByCategory)
        .filter(([category]) => category !== 'Other') // Filter out generic category
        .map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            {/* Category header */}
            <div className="border-b border-gray-300 mb-4">
              <h2 className="font-serif text-xl font-bold pb-2">
                {category}
              </h2>
            </div>
            
            {/* Category items in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryItems.slice(0, 6).map((sport) => (
                <SportCard 
                  key={sport.id} 
                  sport={sport} 
                  priority="medium"
                />
              ))}
            </div>
          </div>
        ))}
        
      {/* More news section for remaining items */}
      {prioritizedSports.length > 5 && (
        <div className="mt-8">
          <div className="border-b border-gray-300 mb-4">
            <h2 className="font-serif text-xl font-bold pb-2">
              More Sports News
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {prioritizedSports.slice(5).map((sport) => (
              <SportCard 
                key={sport.id} 
                sport={sport} 
                priority="low"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}