import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between py-4 pl-4 bg-white text-black border border-gray-500 relative">
      {/* Left: Logo with Font Awesome Newspaper Icon */}
      <div className="flex items-center space-x-4">
        <div className="m-5 w-14 h-14 border border-black rounded-full flex items-center justify-center text-xl">
          <FontAwesomeIcon icon={faNewspaper} />
        </div>
      </div>

      {/* Center: Title & Subtitle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-6xl font-serif font-extrabold">MEDIA MOSAIC</h1>
      </div>

      {/* Right: Login/Signup or User Menu */}
      <div className="flex flex-row px-4 py-2 space-x-4 border-l-2 border-gray-500/80">
        {user ? (
          <>
            <span className="text-black">Welcome, {user.name}</span>
            <Button 
              variant="outline" 
              className="border-black text-black" 
              onClick={logout}
            >
              LOGOUT
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="border-black text-black"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </Button>
            <Button 
              variant="outline" 
              className="border-black text-black"
              onClick={() => navigate('/register')}
            >
              SIGNUP
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;