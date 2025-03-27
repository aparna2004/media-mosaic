import { useNavigate } from 'react-router-dom';
import { navItems } from '@/config/routes';

export const useNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (value: string) => {
    const navItem = navItems.find(item => item.id === value);
    if (navItem) {
      navigate(navItem.path);
    }
  };

  return { handleNavigation };
};