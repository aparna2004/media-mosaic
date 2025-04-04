import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs1";
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '@/config/routes';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.id || 'top-news';
  };

  // Handle navigation with auth check
  const handleNavigation = (path: string, id: string) => {
    // Allow access to top-news without authentication
    if (id === 'top-news') {
      navigate(path);
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Proceed with navigation if authenticated
    navigate(path);
  };

  // Protect routes on direct URL entry
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    
    // Skip check for top-news and login/register routes
    if (
      currentPath === '/' || 
      currentPath === '/login' || 
      currentPath === '/register'
    ) {
      return;
    }
    
    // Redirect to login if not authenticated
    if (!user && currentItem) {
      navigate('/login');
    }
  }, [location.pathname, user, navigate]);

  return (
    <nav className="w-full border border-gray-500 bg-white text-black relative flex items-center justify-between">
      <div className="flex-1">
        <Tabs defaultValue={getCurrentTab()} className="m-1 w-full">
          <TabsList className="flex justify-between space-x-6 p-3 bg-white">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
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
            
            {/* Creators Dialog - Always accessible */}
            <Dialog>
              <DialogTrigger asChild>
                <TabsTrigger
                  value="creators"
                  className={`
                    text-black tracking-wide text-base
                    uppercase font-medium hover:text-gray-600
                    transition-colors duration-200
                  `}
                >
                  Creators
                </TabsTrigger>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border border-gray-300 shadow-md">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif font-bold text-center mb-4">
                    Meet the Creators
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-4">
                  <div className="flex flex-col items-center">
                    <a 
                      href="https://github.com/aparna2004" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <img 
                        src="https://github.com/aparna2004.png" 
                        alt="Aparna's GitHub" 
                        className="rounded-full w-32 h-32 border-2 border-gray-300 group-hover:border-red-500 transition-all"
                      />
                      <p className="mt-2 text-center font-medium group-hover:text-red-500">Aparna</p>
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <a 
                      href="https://github.com/hajay180505" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <img 
                        src="https://github.com/hajay180505.png" 
                        alt="Ajay's GitHub" 
                        className="rounded-full w-32 h-32 border-2 border-gray-300 group-hover:border-red-500 transition-all"
                      />
                      <p className="mt-2 text-center font-medium group-hover:text-red-500">Ajay</p>
                    </a>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Preferences Button - Only show if logged in */}
      <div className="px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => user ? navigate('/preferences') : navigate('/login')}
          className="hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
