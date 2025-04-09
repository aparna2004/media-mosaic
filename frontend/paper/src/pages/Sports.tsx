import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SportsLayout from "@/components/SportsLayout";
import { SportsItem } from "@/types/sports";
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sports = () => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = !!token && !!user;
    setIsAuthenticated(authenticated);
    
    console.log('Current token:', token ? 'exists' : 'not found');
    console.log('Current user:', user);
    console.log('Authentication status:', authenticated);
    
    // Redirect to login if not authenticated
    if (!authenticated) {
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Only fetch data if authenticated
  const fetchSports = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
      throw new Error('Authentication required');
    }
    
    // Always use the authenticated endpoint
    const endpoint = `${API_BASE_URL}/news/sports`;
    
    console.log(`Fetching sports from: ${endpoint}`);
    
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const { data } = await axios.get(endpoint, { headers });
      
      // Filter only sports content
      const filteredSports = Array.isArray(data) 
        ? data.filter(item => {
            // Check if sports category exists in any category
            const hasCategory = item.category.some(
              (cat: string) => cat.toLowerCase() === 'sports' || 
              cat.toLowerCase() === 'cricket' ||
              cat.toLowerCase() === 'football'            );
            
            return hasCategory;
          })
        : [];
        
      console.log(`Sports data fetched successfully: ${filteredSports.length} items`);
      return filteredSports as SportsItem[];
    } catch (error) {
      console.error('Error fetching sports:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          console.log('Authentication token expired, redirecting to login...');
          navigate('/login');
        }
      }
      throw error;
    }
  };

  // Skip the query if not authenticated
  const { data: sports, isLoading, error } = useQuery({
    queryKey: ['sports', isAuthenticated],
    queryFn: fetchSports,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated, // Only run query if authenticated
  });
  
  // Don't show loading state if we're not authenticated yet
  if (isLoading && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold">Loading sports news...</div>
      </div>
    );
  }

  if (error && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-auto">
        <div className="text-xl font-semibold text-red-600">
          {error instanceof Error ? error.message : 'Failed to load sports news'}
        </div>
      </div>
    );
  }

  // If authenticated but no sports data is available
  if (isAuthenticated && (!sports || sports.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">No Sports News Available</h2>
          <p className="text-gray-600">Check back later for updates on the latest sports events.</p>
        </div>
      </div>
    );
  }

  // Only render the layout if authenticated and sports data exists
  return isAuthenticated && sports ? (
    <div className="max-w-7xl mx-auto px-4">
      <SportsLayout sports={sports} />
    </div>
  ) : null;
};

export default Sports;