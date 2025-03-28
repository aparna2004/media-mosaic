import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GitHubRedirectProps {
  username: string;
}

const GitHubRedirect = ({ username }: GitHubRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Open GitHub profile in a new window/tab
    window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer');
    // Navigate back to home page
    navigate('/');
  }, [username, navigate]);

  return null;
};

export default GitHubRedirect;