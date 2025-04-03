import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '@/config/routes';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.id || 'top-news';
  };

  const handleNavigation = (value: string) => {
    const navItem = navItems.find(item => item.id === value);
    if (!navItem) return;

    // Handle GitHub redirects
    if (navItem.id === 'ajay' || navItem.id === 'aparna') {
      const username = navItem.id === 'ajay' ? 'hajay180505' : 'aparna2004';
      window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer');
      return;
    }

    // Regular navigation
    navigate(navItem.path);
  };

  return (
    <nav className="w-full border border-gray-500 bg-white text-black relative flex items-center justify-center">
      <div className="flex w-full">
        <Tabs defaultValue={getCurrentTab()} className="m-1 w-full" onValueChange={handleNavigation}>
          <TabsList className="flex w-full justify-between space-x-6 p-3 bg-white">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
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
    </nav>
  );
};

export default Navbar;
