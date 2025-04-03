import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs1";
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '@/config/routes';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.id || 'top-news';
  };

  return (
    <nav className="w-full border border-gray-500 bg-white text-black relative flex items-center justify-between">
      <div className="flex-1">
        <Tabs defaultValue={getCurrentTab()} className="m-1 w-full">
          <TabsList className="flex justify-between space-x-6 p-3 bg-white">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  text-black tracking-wide text-base
                  uppercase font-medium hover:text-gray-600
                  transition-colors duration-200
                  data-[state=active]:text-red-600 
                  data-[state=active]:bg-transparent
                  data-[state=active]:font-semibold
                `}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Preferences Button */}
      <div className="px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/preferences')}
          className="hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
