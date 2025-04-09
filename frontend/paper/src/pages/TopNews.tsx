import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NewsLayout from "@/components/NewsLayout";
import { NewsItem } from "@/types/news";
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const TopNews = () => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token && !!user);
    console.log('Current token:', token ? 'exists' : 'not found');
    console.log('Current user:', user);
    console.log('Authentication status:', !!token && !!user);
  }, [user]);
  
  const fetchNews = async () => {
    const token = localStorage.getItem('token');
    
    const endpoint = token && user 
      ? `${API_BASE_URL}/news/general` 
      : `${API_BASE_URL}/news`;
    
    console.log(`Fetching news from: ${endpoint}`);
    
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['Content-Type'] = 'application/json';
      }
      
      const { data } = await axios.get(endpoint, { headers });
      console.log('News data fetched successfully');
      return data as NewsItem[];
    } catch (error) {
      console.error('Error fetching news:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  };

  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ['news', isAuthenticated],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, 
  }); 
  
  useEffect(() => {
    console.log('Authentication status changed, refetching data');
    refetch();
  }, [isAuthenticated, refetch]);
  
  console.log('Rendering news data:', news?.length || 0, 'items');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold text-red-600">
          {error instanceof Error ? error.message : 'Failed to load news'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto overflow-auto">
      <NewsLayout news={news || []} />
    </div>
  );
};

export default TopNews;